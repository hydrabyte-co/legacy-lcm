import { Entity, Column, Index } from 'typeorm';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Resources } from 'src/common/enums/resources';

@Entity(Resources.LCM_Transactions)
export class Transaction extends Base {
  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  customerCode = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  contractCode = '';

  @Column()
  @IsNumber()
  amount = 0;

  @Column()
  @IsDate()
  date: Date = new Date();

  @Column()
  @IsString()
  fromFile = '';
}
