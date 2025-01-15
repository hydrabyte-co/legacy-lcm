import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Customer } from '../customer/entity/customer.entity';
import { Contract } from '../contract/entity/contract.entity';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { logInfo } from 'src/common/utils/log-helper';
import { Activity } from '../activity/entity/activity.entity';
import { Transaction } from '../transaction/entity/transaction.entity';
@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: MongoRepository<Customer>,
    @InjectRepository(Contract)
    private readonly contractsRepository: MongoRepository<Contract>,
    @InjectRepository(Activity)
    private readonly activitiesRepository: MongoRepository<Activity>,
    @InjectRepository(Transaction)
    private readonly transactionsRepository: MongoRepository<Transaction>,
  ) {}

  async handleAggregateStream(aggregateStream: any): Promise<any[]> {
    const aggrResult = [];
    if (aggregateStream) {
      let aggrItem = undefined;
      do {
        aggrItem = await aggregateStream.next();
        if (aggrItem) {
          delete aggrItem._id;
          aggrResult.push(aggrItem);
        }
      } while (aggrItem != null);
    }
    return aggrResult;
  }

  getStartOfMonthUTC7() {
    // Lấy thời gian hiện tại theo UTC
    const now = new Date();

    // Lấy năm và tháng từ thời gian hiện tại theo UTC
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();

    // Tạo ngày đầu tháng theo UTC+0
    const startOfMonthUTC = new Date(Date.UTC(year, month, 1, 0, 0, 0));

    // Trừ đi offset để chuyển về UTC (UTC+0)
    const offsetMilliseconds = -7 * 60 * 60 * 1000; // -7 giờ (UTC+7)
    const startOfMonthUTC7 = new Date(
      startOfMonthUTC.getTime() + offsetMilliseconds,
    );

    return startOfMonthUTC7;
  }

  getStartOfTodayUTC7() {
    // Lấy thời gian hiện tại theo UTC
    const now = new Date();

    // Lấy năm, tháng và ngày hiện tại theo UTC
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const date = now.getUTCDate();

    // Tạo thời gian đầu ngày hôm nay theo UTC
    const startOfDayUTC = new Date(Date.UTC(year, month, date, 0, 0, 0));

    // Trừ đi offset để chuyển về UTC (UTC+0)
    const offsetMilliseconds = -7 * 60 * 60 * 1000; // -7 giờ (UTC+7)
    const startOfTodayUTC7 = new Date(
      startOfDayUTC.getTime() + offsetMilliseconds,
    );

    return startOfTodayUTC7;
  }

  async customerSummaryReport(handler: DataHandler): Promise<any> {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let staffCodes = [];
    if (handler.roles.indexOf('org.staff') >= 0) {
      if (handler.staffCode === '263') {
        staffCodes = [
          '263',
          '330',
          '313',
          '269',
          '332',
          '267',
          '335',
          '261',
          '275',
          '268',
        ];
      } else if (handler.staffCode === '272') {
        /* staffCodes = [
          '272',
          '265',
          '125',
          '346',
          '350',
          '352',
          '358',
          '361',
          '363',
          '364',
          '365',
          '408',
          '410',
        ]; */
      } else {
        staffCodes = [handler.staffCode || '_'];
      }
    } else {
    }
    const pipeline = [
      {
        $match: {
          status: 'active',
          callStaffCode:
            staffCodes.length === 0
              ? /.+/
              : {
                  $in: staffCodes,
                },
        },
      },
      {
        $project: {
          _id: 1,
          code: 1,
          callStaffCode: 1,
          activities: {
            $abs: 0,
          },
          hasActivity: {
            $cond: [
              {
                $gte: ['$lastActivity.performAt', firstDayOfMonth],
              },
              true,
              false,
            ],
          },
          ptpAmount: {
            $cond: [
              {
                $gte: ['$lastPTPActivity.performAt', firstDayOfMonth],
              },
              '$lastPTPActivity.ptpAmount',
              0,
            ],
          },
        },
      },
      {
        $facet: {
          totalCustomers: [
            {
              $count: 'count',
            },
          ],
          interactedCustomers: [
            {
              $match: {
                hasActivity: true,
              },
            },
            {
              $count: 'count',
            },
          ],
          ptpCustomers: [
            {
              $match: {
                ptpAmount: {
                  $gt: 0,
                },
              },
            },
            {
              $count: 'count',
            },
          ],
          totalPTPAmount: [
            {
              $match: {
                ptpAmount: {
                  $gt: 0,
                },
              },
            },
            {
              $group: {
                _id: null,
                totalAmount: {
                  $sum: '$ptpAmount',
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalCustomers: {
            $arrayElemAt: ['$totalCustomers.count', 0],
          },
          interactedCustomers: {
            $arrayElemAt: ['$interactedCustomers.count', 0],
          },
          ptpCustomers: {
            $arrayElemAt: ['$ptpCustomers.count', 0],
          },
          totalPTPAmount: {
            $ifNull: [
              {
                $arrayElemAt: ['$totalPTPAmount.totalAmount', 0],
              },
              0,
            ],
          },
        },
      },
    ];
    logInfo('*', `report.service.customersSummary => pipeline`, pipeline);
    const stream = await this.customersRepository.aggregate(pipeline);
    const results = await this.handleAggregateStream(stream);
    let reportData = {
      reportedAt: firstDayOfMonth,
      totalCustomers: 0,
      interactedCustomers: 0,
      ptpCustomers: 0,
      totalPTPAmount: 0,
    };
    if (results.length > 0) {
      reportData = {
        ...reportData,
        ...results[0],
      };
    }
    return reportData;
  }

  async tasksSummaryReport(handler: DataHandler): Promise<any> {
    const today = new Date();
    /* const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let staffCodes = [];
    if (handler.roles.indexOf('org.staff') >= 0) {
      if (handler.staffCode === '263') {
        staffCodes = [
          '263',
          '330',
          '313',
          '269',
          '332',
          '267',
          '335',
          '261',
          '275',
          '268',
        ];
      } else if (handler.staffCode === '272') {
        staffCodes = [
          '272',
          '265',
          '125',
          '346',
          '350',
          '352',
          '358',
          '361',
          '363',
          '364',
          '365',
          '408',
          '410',
        ];
      } else {
        staffCodes = [handler.staffCode || '_'];
      }
    } else {
    }
    const pipeline = [
      {
        $match: {
          status: 'active',
          callStaffCode:
            staffCodes.length === 0
              ? /.+/
              : {
                  $in: staffCodes,
                },
        },
      },
      {
        $project: {
          _id: 1,
          code: 1,
          callStaffCode: 1,
          activities: {
            $abs: 0,
          },
          hasActivity: {
            $cond: [
              {
                $gte: ['$lastActivity.performAt', firstDayOfMonth],
              },
              true,
              false,
            ],
          },
          ptpAmount: {
            $cond: [
              {
                $gte: ['$lastPTPActivity.performAt', firstDayOfMonth],
              },
              '$lastPTPActivity.ptpAmount',
              0,
            ],
          },
        },
      },
      {
        $facet: {
          totalCustomers: [
            {
              $count: 'count',
            },
          ],
          interactedCustomers: [
            {
              $match: {
                hasActivity: true,
              },
            },
            {
              $count: 'count',
            },
          ],
          ptpCustomers: [
            {
              $match: {
                ptpAmount: {
                  $gte: 0,
                },
              },
            },
            {
              $count: 'count',
            },
          ],
          totalPTPAmount: [
            {
              $match: {
                ptpAmount: {
                  $gt: 0,
                },
              },
            },
            {
              $group: {
                _id: null,
                totalAmount: {
                  $sum: '$ptpAmount',
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalCustomers: {
            $arrayElemAt: ['$totalCustomers.count', 0],
          },
          interactedCustomers: {
            $arrayElemAt: ['$interactedCustomers.count', 0],
          },
          ptpCustomers: {
            $arrayElemAt: ['$ptpCustomers.count', 0],
          },
          totalPTPAmount: {
            $ifNull: [
              {
                $arrayElemAt: ['$totalPTPAmount.totalAmount', 0],
              },
              0,
            ],
          },
        },
      },
    ];
    logInfo('*', `report.service.customersSummary => pipeline`, pipeline);
    const stream = await this.customersRepository.aggregate(pipeline);
    const results = await this.handleAggregateStream(stream); */
    let reportData = {
      totalTasks: 0,
      todoTasks: 0,
      doneTasks: 0,
    };
    /* if (results.length > 0) {
      reportData = {
        ...reportData,
        ...results[0],
      };
    } */
    return reportData;
  }

  async debtCollectionByBank(handler: DataHandler): Promise<any> {
    const firstDayOfMonth = this.getStartOfMonthUTC7();
    const today = this.getStartOfTodayUTC7();
    //let staffCodes = [];

    const customerPipeline = [
      {
        $match: {
          status: 'active',
          callStaffCode: /[0-9]+/,
        },
      },
      {
        $project: {
          _id: 1,
          code: 1,
          partnerCode: 1,
          callStaffCode: 1,
          activities: {
            $abs: 0,
          },
          hasActivity: {
            $cond: [
              {
                $gte: ['$lastActivity.performAt', firstDayOfMonth],
              },
              1,
              0,
            ],
          },
          ptpAmount: {
            $cond: [
              {
                $gte: ['$lastPTPActivity.performAt', firstDayOfMonth],
              },
              '$lastPTPActivity.ptpAmount',
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            partnerCode: '$partnerCode',
          },
          totalCustomers: { $sum: 1 },
          interactedCustomers: { $sum: '$hasActivity' },
          ptpAmount: { $sum: '$ptpAmount' },
        },
      },
      {
        $project: {
          partnerCode: '$_id.partnerCode',
          totalCustomers: 1,
          interactedCustomers: 1,
          ptpAmount: 1,
          collectedAmount: { $ceil: 0 },
        },
      },
    ];
    const activityPipeline = [
      {
        $match: {
          type: 'call',
          createdAt: {
            $gte: today,
          },
        },
      },
      {
        $project: {
          partnerCode: {
            $arrayElemAt: [{ $split: ['$customerCode', '-'] }, 0],
          },
          staffCode: 1,
          resultParentCode: 1,
          isAnswered: {
            $cond: [
              {
                $ne: ['$resultParentCode', 'UTC'],
              },
              1,
              0,
            ],
          },
          isNoAnswered: {
            $cond: [
              {
                $eq: ['$resultParentCode', 'UTC'],
              },
              1,
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            partnerCode: '$partnerCode',
          },
          totalCalls: { $sum: 1 },
          totalAnsweredCalls: { $sum: '$isAnswered' },
          totalNoAnsweredCalls: { $sum: '$isNoAnswered' },
        },
      },
      {
        $project: {
          partnerCode: '$_id.partnerCode',
          totalCalls: 1,
          totalAnsweredCalls: 1,
          totalNoAnsweredCalls: 1,
          answeredRate: {
            $cond: {
              if: { $gt: ['$totalCalls', 0] }, // Check if totalCalls > 0
              then: {
                $multiply: [
                  { $divide: ['$totalAnsweredCalls', '$totalCalls'] },
                  100,
                ],
              }, // Calculate percentage
              else: 0, // Default to 0 if totalCalls is 0
            },
          },
        },
      },
    ];
    const tranPipelines = [
      {
        $match: {
          date: {
            $gte: firstDayOfMonth,
          },
        },
      },
      {
        $project: {
          partnerCode: {
            $arrayElemAt: [{ $split: ['$customerCode', '-'] }, 0],
          },
          staffCode: 1,
          customerCode: 1,
          amount: 1,
          date: 1,
        },
      },
      {
        $group: {
          _id: {
            partnerCode: '$partnerCode',
          },
          amount: { $sum: '$amount' },
          payments: { $sum: 1 },
        },
      },
      {
        $project: {
          partnerCode: '$_id.partnerCode',
          amount: 1,
          payments: 1,
        },
      },
    ];
    logInfo(
      '*',
      `report.service.debtCollectionReport => pipeline`,
      customerPipeline,
    );
    const customerStream = await this.customersRepository.aggregate(
      customerPipeline,
    );
    const activityStream = await this.activitiesRepository.aggregate(
      activityPipeline,
    );
    const tranStream = await this.transactionsRepository.aggregate(
      tranPipelines,
    );
    const customersResults = (
      await this.handleAggregateStream(customerStream)
    ).sort((n, p) => (n.partnerCode < p.partnerCode ? 1 : -1));
    const activityResults = await this.handleAggregateStream(activityStream);
    const tranResults = await this.handleAggregateStream(tranStream);

    let reportData = [];
    if (customersResults.length > 0) {
      const total = {
        totalCustomers: 0,
        interactedCustomers: 0,
        ptpAmount: 0,
        partnerCode: 'ALL',
        collectedAmount: 0,
        totalCalls: 0,
        totalAnsweredCalls: 0,
        totalNoAnsweredCalls: 0,
        answeredRate: 0,
        payments: 0,
      };
      for (let i = 0; i < customersResults.length; i++) {
        let r = customersResults[i];
        const foundAR = activityResults.find(
          (ar) => ar.partnerCode === r.partnerCode,
        );
        const foundTR = tranResults.find(
          (tr) => tr.partnerCode === r.partnerCode,
        );
        if (foundAR) {
          r = { ...r, ...foundAR };
        } else {
          r.totalCalls = 0;
          r.totalAnsweredCalls = 0;
          r.totalNoAnsweredCalls = 0;
          r.answeredRate = 0;
        }
        if (foundTR) {
          r.collectedAmount = foundTR.amount;
          r.payments = foundTR.payments;
        } else {
          r.collectedAmount = 0;
          r.payments = 0;
        }

        total.totalCustomers += r.totalCustomers;
        total.interactedCustomers += r.interactedCustomers;
        total.ptpAmount += r.ptpAmount;
        total.collectedAmount += r.collectedAmount;
        total.totalCalls += r.totalCalls;
        total.totalAnsweredCalls += r.totalAnsweredCalls;
        total.totalNoAnsweredCalls += r.totalNoAnsweredCalls;
        total.answeredRate += r.answeredRate;
        total.payments += r.payments;

        customersResults[i] = r;
      }
      if (customersResults.length > 0)
        total.answeredRate = Math.floor(
          total.answeredRate / customersResults.length,
        );
      customersResults.push(total);
      reportData = [...customersResults];
    }
    return reportData;
  }

  async debtCollectionByStaff(handler: DataHandler): Promise<any> {
    const firstDayOfMonth = this.getStartOfMonthUTC7();
    const today = this.getStartOfTodayUTC7();
    //let staffCodes = [];

    const customerPipeline = [
      {
        $match: {
          status: 'active',
          callStaffCode: /[0-9]+/,
        },
      },
      {
        $project: {
          _id: 1,
          code: 1,
          partnerCode: 1,
          callStaffCode: 1,
          activities: {
            $abs: 0,
          },
          hasActivity: {
            $cond: [
              {
                $gte: ['$lastActivity.performAt', firstDayOfMonth],
              },
              1,
              0,
            ],
          },
          ptpAmount: {
            $cond: [
              {
                $gte: ['$lastPTPActivity.performAt', firstDayOfMonth],
              },
              '$lastPTPActivity.ptpAmount',
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            callStaffCode: '$callStaffCode',
          },
          totalCustomers: { $sum: 1 },
          interactedCustomers: { $sum: '$hasActivity' },
          ptpAmount: { $sum: '$ptpAmount' },
        },
      },
      {
        $project: {
          staffCode: '$_id.callStaffCode',
          totalCustomers: 1,
          interactedCustomers: 1,
          ptpAmount: 1,
          collectedAmount: { $ceil: 0 },
        },
      },
    ];
    const activityPipeline = [
      {
        $match: {
          type: 'call',
          createdAt: {
            $gte: today,
          },
        },
      },
      {
        $project: {
          partnerCode: {
            $arrayElemAt: [{ $split: ['$customerCode', '-'] }, 0],
          },
          staffCode: 1,
          resultParentCode: 1,
          isAnswered: {
            $cond: [
              {
                $ne: ['$resultParentCode', 'UTC'],
              },
              1,
              0,
            ],
          },
          isNoAnswered: {
            $cond: [
              {
                $eq: ['$resultParentCode', 'UTC'],
              },
              1,
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            staffCode: '$staffCode',
          },
          totalCalls: { $sum: 1 },
          totalAnsweredCalls: { $sum: '$isAnswered' },
          totalNoAnsweredCalls: { $sum: '$isNoAnswered' },
        },
      },
      {
        $project: {
          staffCode: '$_id.staffCode',
          totalCalls: 1,
          totalAnsweredCalls: 1,
          totalNoAnsweredCalls: 1,
          answeredRate: {
            $cond: {
              if: { $gt: ['$totalCalls', 0] }, // Check if totalCalls > 0
              then: {
                $multiply: [
                  { $divide: ['$totalAnsweredCalls', '$totalCalls'] },
                  100,
                ],
              }, // Calculate percentage
              else: 0, // Default to 0 if totalCalls is 0
            },
          },
        },
      },
    ];
    const tranPipelines = [
      {
        $match: {
          date: {
            $gte: firstDayOfMonth,
          },
        },
      },
      {
        $project: {
          partnerCode: {
            $arrayElemAt: [{ $split: ['$customerCode', '-'] }, 0],
          },
          staffCode: 1,
          customerCode: 1,
          amount: 1,
          date: 1,
        },
      },
      {
        $group: {
          _id: {
            staffCode: '$staffCode',
          },
          amount: { $sum: '$amount' },
          payments: { $sum: 1 },
        },
      },
      {
        $project: {
          staffCode: '$_id.staffCode',
          amount: 1,
          payments: 1,
        },
      },
    ];
    logInfo(
      '*',
      `report.service.debtCollectionReport => pipeline`,
      customerPipeline,
    );
    const customerStream = await this.customersRepository.aggregate(
      customerPipeline,
    );
    const activityStream = await this.activitiesRepository.aggregate(
      activityPipeline,
    );
    const tranStream = await this.transactionsRepository.aggregate(
      tranPipelines,
    );
    const customersResults = (
      await this.handleAggregateStream(customerStream)
    ).sort((n, p) => parseInt(n.staffCode) - parseInt(p.staffCode));
    const activityResults = await this.handleAggregateStream(activityStream);
    const tranResults = await this.handleAggregateStream(tranStream);

    let reportData = [];
    if (customersResults.length > 0) {
      const total = {
        totalCustomers: 0,
        interactedCustomers: 0,
        ptpAmount: 0,
        partnerCode: 'ALL',
        collectedAmount: 0,
        totalCalls: 0,
        totalAnsweredCalls: 0,
        totalNoAnsweredCalls: 0,
        answeredRate: 0,
        payments: 0,
      };
      for (let i = 0; i < customersResults.length; i++) {
        let r = customersResults[i];
        const foundAR = activityResults.find(
          (ar) => ar.staffCode === r.staffCode,
        );
        const foundTR = tranResults.find(
          (tr) => tr.staffCode?.toString() === r.staffCode?.toString(),
        );
        if (foundAR) {
          r = { ...r, ...foundAR };
        } else {
          r.totalCalls = 0;
          r.totalAnsweredCalls = 0;
          r.totalNoAnsweredCalls = 0;
          r.answeredRate = 0;
        }
        if (foundTR) {
          r.collectedAmount = foundTR.amount;
          r.payments = foundTR.payments;
        } else {
          r.collectedAmount = 0;
          r.payments = 0;
        }

        r.collectedAmount = 0;
        total.totalCustomers += r.totalCustomers;
        total.interactedCustomers += r.interactedCustomers;
        total.ptpAmount += r.ptpAmount;
        total.collectedAmount += r.collectedAmount;
        total.totalCalls += r.totalCalls;
        total.totalAnsweredCalls += r.totalAnsweredCalls;
        total.totalNoAnsweredCalls += r.totalNoAnsweredCalls;
        total.answeredRate += r.answeredRate;
        total.payments += r.payments;

        customersResults[i] = r;
      }
      if (customersResults.length > 0)
        total.answeredRate = Math.floor(
          total.answeredRate / customersResults.length,
        );
      customersResults.push(total);
      reportData = [...customersResults];
    }
    return reportData;
  }
}
