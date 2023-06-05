import { ObjectId } from 'mongodb';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from 'src/common/modules/base/base.service';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { Activity } from '../activity/entity/activity.entity';
import { Customer } from '../customer/entity/customer.entity';
import { Result } from '../result/entity/result.entity';
import { Contract } from '../contract/entity/contract.entity';
import {
  FindManyFilter,
  FindAllResult,
} from 'src/common/modules/base/dto/find-many.dto';
import { Transaction } from '../transaction/entity/transaction.entity';

@Injectable()
export class DataHandlerService {
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

  async processCustomerData(handler: DataHandler): Promise<any> {
    const customers = await this.customersRepository.find({
      where: { status: 'active' },
    });
    for (let i = 0; i < customers.length; i++) {
      const customer: Customer = customers[i];
      const now = new Date();
      const fdom = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      console.log(`${i}/${customers.length} ${customer.code}`);
      const contracts: Contract[] = await this.contractsRepository.find({
        where: { customerCode: customer.code, status: 'active' },
      });
      const activities: Activity[] = await this.activitiesRepository.find({
        where: { customerCode: customer.code, performAt: { $gt: fdom } },
      });
      /* const tracsactions = await this.transactionsRepository.find({
        where: { customerCode: customer.code  },
        order: { date: -1 },
        take: 1,
        skip: 0,
      }); */
      const newData: any = {
        acim: 0,
        tpaim: 0,
        tpafpim: 0,
        rcim: [],
        tbim: 0,
        lovdd: 0,
        contractCodes: [],
        sols: [],
      };
      let largestOVDDays = 0;
      console.log(`-- Contracts: `, contracts.length);
      console.log(`-- Activities: `, activities.length);
      newData.acim = activities.length;

      // set lastPaidDate
      for (let j = 0; j < contracts.length; j++) {
        const contract = contracts[j];
        if (contract.lastPaymentDate) {
          if (i === 0 || customer.lastPaidDate === undefined) {
            newData.lastPaidDate = contract.lastPaymentDate;
            newData.lastPaidAmount = contract.lastPaymentAmount;
          } else {
            if (
              customer.lastPaidDate.getTime() <
              contract.lastPaymentDate.getTime()
            ) {
              newData.lastPaidDate = contract.lastPaymentDate;
              newData.lastPaidAmount = contract.lastPaymentAmount;
            }
          }
        }

        if (contract.totalPaymentAmount) {
          newData.tpaim += contract.totalPaymentAmount;
        }
        if (contract.totalPaymentAmountFromPartner) {
          newData.tpafpim += contract.totalPaymentAmountFromPartner;
        }
        if (contract.totalBalance) {
          newData.tbim += contract.totalBalance;
        }
        if (contract.ovdDays) {
          if (contract.ovdDays > largestOVDDays) {
            largestOVDDays = contract.ovdDays;
          }
        }
        // Generate contractCodes array
        if (newData.contractCodes.indexOf(contract.code) < 0) {
          newData.contractCodes.push(contract.code);
        }
        if (newData.sols.indexOf(contract.statusOfLoan) < 0) {
          newData.sols.push(contract.statusOfLoan);
        }
      }
      newData.lovdd = largestOVDDays;

      for (let j = 0; j < activities.length; j++) {
        const activity = activities[j];
        if (activity.resultCode) {
          if (newData.rcim.indexOf(activity.resultCode) < 0) {
            newData.rcim.push(activity.resultCode);
          }
        }
      }

      if (customer.lastActivity === undefined) {
        if (activities.length > 0) {
          const lastActivity = activities[activities.length - 1];
          newData.lastActivity = {
            id: lastActivity.id,
            resultCode: lastActivity.resultCode,
            resultParentCode: lastActivity.resultParentCode,
            ptpAmount: lastActivity.ptpAmount,
            ptpDate: lastActivity.ptpDate,
            performAt: lastActivity.performAt,
          };
        }
      }

      // set lastPaidDate by transactions
      /*  if (tracsactions) {
        if (tracsactions.length > 0) {
          newData.lastPaidDate = tracsactions[0].date;
        }
      } */

      console.log(`-- newData: `, newData);
      const updateCustomerResult = await this.customersRepository.update(
        customer.id,
        newData,
      );
      console.log(`-- update result: `, updateCustomerResult.affected);
    }
    return {};
  }
}
