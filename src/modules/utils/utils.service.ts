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
import { CustomerData, OriginateAutoCallData } from './dto/util';
import { logInfo } from 'src/common/utils/log-helper';
import { Customer } from '../customer/entity/customer.entity';
import { Contract } from '../contract/entity/contract.entity';
import axios from 'axios';

@Injectable()
export class UtilService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: MongoRepository<Customer>,
    @InjectRepository(Contract)
    private readonly contractsRepository: MongoRepository<Contract>,
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

  async originateAutoCall(
    data: OriginateAutoCallData,
    handler: DataHandler,
  ): Promise<any> {
    const customer = await this.customersRepository.findOneBy({
      code: data.customerCode,
      isDeleted: false,
    });
    if (customer) {
      const contract = await this.contractsRepository.findOneBy({
        customerCode: data.customerCode,
        isDeleted: false,
      });
      const callData: any = {
        dialplanId: data.dialplanId,
        toNumber: data.toNumber,
        fromNumber: data.fromNumber,
        orgId: handler.orgId,
        direction: 'outbound',
        data: {
          debt: '',
          customer: '',
          title: 'oong',
          company: '',
        },
      };
      if (contract) {
        callData.data.debt = Math.floor(contract.ovdBalance);
        callData.data.customer = customer.fullname;
        callData.data.title = customer.gender === 'male' ? 'oong' : 'baf';
        callData.data.company = '';
      }
      const apiURL = `${process.env.VOICE_API_ROOT_URL}/calls/originate`;
      const config = {
        method: 'post',
        url: apiURL,
        headers: {
          Authorization: `Basic ${process.env.VOICE_API_BASIC_AUTH}`,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(callData),
      };

      const apiResult = await axios(config)
        .then((r) => {
          return {
            code: '',
            status: r.status,
            statusText: r.statusText,
            data: r.data,
          };
        })
        .catch((e) => {
          return {
            code: e.code,
            status: e.response.status,
            statusText: e.response.statusText,
            data: undefined,
          };
        });

      if (apiResult.data) {
        return apiResult.data;
      } else {
        throw new InternalServerErrorException(apiResult);
      }
    } else {
      throw new BadRequestException(
        `Customer code '${data.customerCode}' is invalid!`,
      );
    }
  }
}
