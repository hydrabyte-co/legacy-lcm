import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Customer } from '../customer/entity/customer.entity';
import { Contract } from '../contract/entity/contract.entity';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { logInfo } from 'src/common/utils/log-helper';
@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: MongoRepository<Customer>,
    @InjectRepository(Contract)
    private readonly contractsRepository: MongoRepository<Contract>,
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
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let staffCodes = [];

    const pipeline = [
      {
        $match: {
          status: 'active',
          callStaffCode: /.+/,
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
    logInfo('*', `report.service.debtCollectionReport => pipeline`, pipeline);
    const stream = await this.customersRepository.aggregate(pipeline);
    const results = await this.handleAggregateStream(stream);
    let reportData = [];
    if (results.length > 0) {
      let total = {
        totalCustomers: 0,
        interactedCustomers: 0,
        ptpAmount: 0,
        partnerCode: 'ALL',
        collectedAmount: 0,
      };
      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        total.totalCustomers += r.totalCustomers;
        total.interactedCustomers += r.interactedCustomers;
        total.ptpAmount += r.ptpAmount;
        total.collectedAmount += r.collectedAmount;
      }
      results.push(total);
      reportData = [...results];
    }
    return reportData;
  }
}
