import { Column, Entity } from 'typeorm';
import { Resources } from '../../enums/resources';
import { MixedObject } from '../../types/data';
import { Base } from '../base/entity/base.entity';
import { ScheduledTaskLogStatuses } from '../scheduled-task-log/scheduled-task-log.misc';
import { ScheduledTaskStatuses } from './scheduled-task.misc';

@Entity(Resources.ScheduledTask)
export class ScheduledTask extends Base {
  @Column()
  type: string;

  @Column()
  schedule: string;

  @Column()
  parameters: MixedObject;

  @Column()
  lastRunData: {
    logId?: string;
    errorData?: MixedObject;
    resultData?: MixedObject;
    status?: ScheduledTaskLogStatuses;
    runAt?: Date;
  };

  @Column()
  nextRunAt: Date;

  @Column()
  note: string;

  @Column()
  status: ScheduledTaskStatuses = ScheduledTaskStatuses.Stopped;
}
