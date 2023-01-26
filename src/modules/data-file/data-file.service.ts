import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DataFile } from './entity/data-file.entity';
import { BaseService } from 'src/common/modules/base/base.service';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { CreateDataFileData } from './dto/create.dto';
import { DataFileStatus } from './enum/data-file.enum';

@Injectable()
export class DataFileService extends BaseService<DataFile> {
  constructor(
    @InjectRepository(DataFile)
    private readonly dataFilesRepository: MongoRepository<DataFile>,
  ) {
    super(dataFilesRepository);
  }

  async createOne(
    data: CreateDataFileData,
    handler: DataHandler,
  ): Promise<any> {
    const dataFile = new DataFile();
    dataFile.fileName = data.fileName;
    dataFile.note = data.note;
    return super.createOne(dataFile, handler);
  }

  async findOneByCode(code: string, handler: DataHandler): Promise<any> {
    return super.findOneByField('code', code, handler);
  }
}
