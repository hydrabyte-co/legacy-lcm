import { Entity, Column, Index } from 'typeorm';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDate,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';
import { ContractStatus } from '../enum/contract.enum';

@Entity(Controllers.LCM_Contracts)
export class Contract extends Base {
  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  code = '';

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
  @MaxLength(36)
  guid = '';

  @Column()
  @IsString()
  @MaxLength(36)
  customerCIF = '';

  @Column()
  @IsString()
  @MaxLength(36)
  productGroup = '';

  @Column()
  @IsNumber()
  originalBalance = 0;

  @Column()
  @IsNumber()
  totalBalance = 0;

  @Column()
  @IsNumber()
  ovdBalance = 0;

  @Column()
  @IsNumber()
  performingBalance = 0;

  @Column()
  @IsNumber()
  periodicalPaymentAmount = 0;

  @Column()
  @IsNumber()
  prAmount = 0;

  @Column()
  @IsNumber()
  inAmount = 0;

  @Column()
  @IsNumber()
  peAmount = 0;

  @Column()
  @IsNumber()
  psAmount = 0;

  @Column()
  @IsNumber()
  ovdDays = 0;

  @Column()
  @IsDate()
  valueDate = new Date();

  @Column()
  @IsDate()
  maturityDate = new Date();

  @Column()
  @IsDate()
  ovdDate = new Date();

  @Column()
  @IsNumber()
  dueDayOfMonth = 1;

  @Column()
  @IsNumber()
  bucket = 0;

  @Column()
  @IsString()
  @MaxLength(480)
  term = '';

  @Column()
  @IsDate()
  startedAt: Date = new Date();

  @Column()
  @IsDate()
  endedAt: Date = new Date();

  @Column()
  @IsEnum(ContractStatus)
  status = ContractStatus.Active;
}
