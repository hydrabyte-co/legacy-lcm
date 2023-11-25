import { ObjectId } from 'mongodb';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DataMigration } from '../data-migration/entity/data-migration.entity';
import { logInfo } from 'src/common/utils/log-helper';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(DataMigration)
    private readonly dataMigrationRepo: MongoRepository<DataMigration>,
  ) {}
  async handleDataMigartion(data: any): Promise<any> {
    logInfo(`*`, `EventService.handleDataMigartion -> data`, data);
    return {};
  }
}
