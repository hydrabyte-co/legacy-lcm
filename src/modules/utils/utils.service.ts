import { ObjectId } from 'mongodb';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { CustomerData } from './dto/util';
import { logInfo } from 'src/common/utils/log-helper';
import { Customer } from '../customer/entity/customer.entity';

@Injectable()
export class UtilService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: MongoRepository<Customer>,
  ) {}

  async updateCustomers(
    data: CustomerData[],
    handler: DataHandler,
  ): Promise<any> {
    const result = {
      totalCount: data.length,
      modifiedCount: 0,
      matchedCount: 0,
    };
    logInfo(`*`, `Customers Data: ${data.length}`);
    for (let i = 0; i < data.length; i++) {
      const cusData = data[i];
      let updateResult;
      if (cusData.code) {
        updateResult = await this.customersRepository.update(
          {
            code: cusData.code,
          },
          {
            callStaffCode: cusData.callStaffCode,
          },
        );
        if (updateResult?.raw) {
          if (updateResult?.raw.modifiedCount > 0) {
            result.modifiedCount++;
          }
          if (updateResult?.raw.matchedCount > 0) {
            result.matchedCount++;
          }
        }
      }
      logInfo(`*`, `-- ${i + 1}/${data.length}:`, cusData, updateResult);
    }
    return result;
  }
}
