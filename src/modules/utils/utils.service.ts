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

@Injectable()
export class UtilService {
  constructor() {
    console.log('');
  }
}
