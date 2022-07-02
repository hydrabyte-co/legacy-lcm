import {
  ObjectID,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DataHandler } from './data-handler.class';

export class Base {
  // id
  @ObjectIdColumn() id: ObjectID;
  // isActive
  @Column() isActive?: boolean = false;
  // createdAt
  @CreateDateColumn() createdAt?: Date;
  // changedAt
  @UpdateDateColumn() changedAt?: Date;
  // createdBy
  @Column()
  createdBy: DataHandler = {
    orgId: '',
    appId: '',
    userId: '',
  };
  // changedBy
  @Column()
  changedBy: DataHandler = {
    orgId: '',
    appId: '',
    userId: '',
  };
  // deletedBy
  @Column()
  deletedBy: DataHandler = {
    orgId: '',
    appId: '',
    userId: '',
  };
  // isDeleted
  @Column() isDeleted = false;
}
