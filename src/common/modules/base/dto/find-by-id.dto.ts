import { IsDate, IsObject, IsString } from 'class-validator';
import { DataHandler } from '../entity/data-handler.class';

export class FindByIdResult {
  // id
  @IsString()
  id = '';

  // createdBy
  @IsObject()
  createdBy: DataHandler = {
    orgId: '',
    appId: '',
    userId: '',
  };
  // changedBy
  @IsObject()
  changedBy: DataHandler = {
    orgId: '',
    appId: '',
    userId: '',
  };
  @IsDate()
  createdAt: Date;
  @IsDate()
  changedAt: Date;
}
