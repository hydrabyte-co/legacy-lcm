import { Expose } from 'class-transformer';
import { IsObject, IsOptional } from 'class-validator';
import { DataHandler, DataOwner } from '../entity/data.class';

export class CreateData {
  @IsObject()
  @IsOptional()
  owner?: DataOwner;
  createdBy: DataHandler;
  createdAt: Date;
}
export class CreateResult {
  // id
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;
  @Expose()
  changedAt: Date;
  @Expose()
  deletedAt: Date;
}
