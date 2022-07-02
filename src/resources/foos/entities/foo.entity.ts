import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MaxLength, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Status } from '../enums/foo.enum';

@Entity('foos')
export class Foo {
  // id
  @ObjectIdColumn() id: ObjectID;
  // name
  @Column()
  @IsString()
  @MaxLength(18)
  @IsNotEmpty()
  name: string;
  // result
  @Column()
  status: string = Status.Todo;
  // note
  @Column({ default: '' })
  @IsString()
  @MaxLength(180)
  @IsOptional()
  note?: string = '';
  // isActive
  @Column() isActive?: boolean = false;
  // createdAt
  @CreateDateColumn() createdAt?: Date;
  // changedAt
  @UpdateDateColumn() changedAt?: Date;
  // createdBy
  @Column()
  createdBy: { orgId: string; appId: string; userId: string } = {
    orgId: '',
    appId: '',
    userId: '',
  };
  // isDeleted
  @Column({ default: false }) isDeleted = false;
}
