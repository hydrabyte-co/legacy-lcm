import {
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
} from 'class-validator';
import {
  ObjectId,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DataHandler, DataOwner } from './data.class';

export class Base {
  // id
  @ObjectIdColumn() id: ObjectId;
  // createdAt
  @CreateDateColumn() createdAt: Date = new Date();
  // changedAt
  @UpdateDateColumn() changedAt: Date = new Date();
  // changedAt
  @Column() @IsDate() deletedAt?: Date;
  // owner
  @Column()
  @IsNotEmptyObject()
  @IsObject()
  owner: DataOwner;
  // createdBy
  @Column()
  createdBy: DataHandler = {
    orgId: '',
    appId: '',
    userId: '',
    staffCode: '',
    roles: [],
  };
  // changedBy
  @Column()
  changedBy: DataHandler = {
    orgId: '',
    appId: '',
    userId: '',
    staffCode: '',
    roles: [],
  };
  // deletedBy
  @Column()
  deletedBy: DataHandler = {
    orgId: '',
    appId: '',
    userId: '',
    staffCode: '',
    roles: [],
  };
  // isDeleted
  @Column() isDeleted = false;
}
