import { Controller } from '@nestjs/common';
import { logInfo } from 'src/common/utils/log-helper';
import { WorkerTypes } from '../enums/worker';
import { ScheduledTask } from '../modules/scheduled-task/scheduled-task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CronJob } from 'cron';
import { ObjectId } from 'mongodb';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { ScheduledTaskStatuses } from '../modules/scheduled-task/scheduled-task.misc';
import { ScheduledTaskLog } from '../modules/scheduled-task-log/scheduled-task-log.entity';
import { ScheduledTaskLogStatuses } from '../modules/scheduled-task-log/scheduled-task-log.misc';
import { toVNDatetimeString } from '../utils/datetime-helper';

@Controller()
export class TaskSchedulerWorker {
  private workerType = WorkerTypes.TaskScheduler;
  private workerInterval;
  private workerIntervalTime = 30000;
  private isBusy = false;
  private jobs: Map<string, CronJob> = new Map();
  private rabbitClient: ClientProxy;
  private messagePattern = 'execute-task';

  constructor(
    @InjectRepository(ScheduledTask)
    private readonly taskRepo: MongoRepository<ScheduledTask>,
    @InjectRepository(ScheduledTaskLog)
    private readonly logRepo: MongoRepository<ScheduledTaskLog>,
  ) {
    logInfo('*', `[${this.workerType}] is init...`);
    this.rabbitClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.RABBITMQ_QUEUE,
        queueOptions: { durable: false },
        noAck: false, // Yêu cầu ACK thủ công
        prefetchCount: 1,
      },
    });
  }
  async terminate() {
    logInfo('*', `[${this.workerType}] is terminating...`);
    try {
      const workerIntervalTime = parseInt(process.env.WORKER_INTERVAL_TIME);
      if (workerIntervalTime >= 10000) {
        this.workerIntervalTime = workerIntervalTime;
      }
    } catch (error) {}
    for (const [taskId, job] of this.jobs) {
      job.stop();
    }
    if (this.workerInterval) {
      clearInterval(this.workerInterval);
    }
    if (this.rabbitClient) {
      this.rabbitClient.close();
    }
  }

  async start() {
    this.workerInterval = setInterval(async () => {
      logInfo(
        '*',
        `[${this.workerType}] runs at ${toVNDatetimeString(
          new Date(),
        )}, isBusy = ${this.isBusy}`,
      );
      if (this.isBusy === false) {
        this.isBusy = true;
        // Do logic here
        const tasks = await this.taskRepo.find({
          where: {
            isDeleted: false,
            status: {
              $in: [
                ScheduledTaskStatuses.Scheduled,
                ScheduledTaskStatuses.Unscheduled,
              ],
            },
          },
        });
        logInfo(
          '*',
          `[${this.workerType}] ${tasks.length} tasks, ${this.jobs.size} jobs`,
          tasks.map((t) => {
            return {
              schedule: t.schedule,
              type: t.type,
              note: t.note,
            };
          }),
        );
        const taskIds = new Set(tasks.map((task) => task.id.toString()));

        // Xóa các job không còn trong danh sách scheduled, unscheduled
        for (const [taskId, job] of this.jobs) {
          if (!taskIds.has(taskId)) {
            job.stop();
            this.jobs.delete(taskId);
            await this.taskRepo.updateOne(
              { _id: ObjectId.createFromHexString(taskId) },
              { $set: { jobStatus: 'stopped' } },
            );
            logInfo(
              `[${this.workerType}] Stopped and removed job for task ${taskId}`,
              null,
            );
          }
        }

        // Cập nhật hoặc thêm job mới
        for (const task of tasks) {
          const taskId = task.id.toString();
          if (!this.jobs.has(taskId)) {
            await this.scheduleTask(task);
          } else {
            // Kiểm tra nếu schedule thay đổi thì cập nhật job
            const existingJob = this.jobs.get(taskId);
            //if (existingJob && existingJob.cronTime.source !== task.schedule) {
            if (
              existingJob &&
              task.status === ScheduledTaskStatuses.Unscheduled
            ) {
              existingJob.stop();
              this.jobs.delete(taskId);
              await this.scheduleTask(task);
              logInfo(
                `[${this.workerType}] Rescheduled task ${task.id} '${task.note}' ${task.schedule} (${task.type})`,
                null,
              );
            }
          }
        }

        this.isBusy = false;
      }
    }, this.workerIntervalTime);
  }

  private async scheduleTask(task: ScheduledTask) {
    const taskId = task.id.toString();
    const job = new CronJob(task.schedule, async () => {
      const log = new ScheduledTaskLog();
      const triggeredAt = new Date();
      task = await this.taskRepo.findOneBy({
        _id: task.id,
      });
      logInfo(
        '*',
        `[${this.workerType}] Task ${task.id} '${task.note}' (${
          task.type
        }) triggered at ${toVNDatetimeString(
          triggeredAt,
        )} and next run at ${this.calculateNextRun(task.schedule)}`,
        task,
      );
      log.taskId = task.id.toString();
      log.owner = task.owner;
      log.status = ScheduledTaskLogStatuses.Pending;
      log.createdAt = new Date();
      log.isDeleted = false;
      log.errorData = {};
      log.resultData = {};
      const createLogResult = await this.logRepo.save(log);

      const message = {
        id: task.id,
        logId: createLogResult.id.toString(),
        type: task.type,
        parameters: task.parameters,
        lastRunData: task.lastRunData || {},
        owner: task.owner,
      };
      logInfo(
        '*',
        `[${this.workerType}] Task ${task.id} '${task.note}' (${task.type}) emit pattern '${this.messagePattern}' to queue '${process.env.RABBITMQ_QUEUE}'`,
        message,
      );
      await this.rabbitClient.emit(this.messagePattern, message);

      await this.taskRepo.updateOne(
        { _id: ObjectId.createFromHexString(taskId) },
        {
          $set: {
            lastRunAt: new Date(),
            nextRunAt: this.calculateNextRun(task.schedule),
          },
        },
      );
    });

    job.start();
    this.jobs.set(taskId, job);

    // Cập nhật trạng thái job trong DB
    await this.taskRepo.updateOne(
      { _id: ObjectId.createFromHexString(taskId) },
      { $set: { status: ScheduledTaskStatuses.Scheduled } },
    );
    logInfo(
      '*',
      `[${this.workerType}] Scheduled job for task ${task.id} ${task.note} ${
        task.schedule
      } (${task.type}), next run at ${toVNDatetimeString(
        new Date(job.nextDate().toJSDate()),
      )}`,
      null,
    );
  }

  private calculateNextRun(schedule: string): Date {
    const job = new CronJob(schedule, () => {
      //
    });
    const nextRunAt = job.nextDate().toJSDate();
    job.stop();
    return nextRunAt;
  }
}
