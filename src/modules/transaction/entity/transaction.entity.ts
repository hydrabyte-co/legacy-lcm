import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsString,
    MaxLength
} from 'class-validator';
import { Column, Entity } from 'typeorm';
import { Resources } from '../../../common/enums/resources';
import { Base } from '../../../common/modules/base/entity/base.entity';

@Entity(Resources.LCM_Transactions)
export class Transaction extends Base {
  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  partnerCode = '';

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
  @IsString()
  staffCode = '';

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
