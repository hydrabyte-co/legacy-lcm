import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsDate,
  IsNumber,
  IsEnum,
} from 'class-validator';
import {
  UpdateOneData,
  UpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';
import { ContractStatus } from '../enum/contract.enum';

export class UpdateContractData extends UpdateOneData {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  code;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  partnerCode;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  customerCode;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  guid;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  customerCIF;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  productGroup;

  @IsOptional()
  @IsNumber()
  originalBalance;

  @IsOptional()
  @IsNumber()
  TotalBalance;

  @IsOptional()
  @IsNumber()
  ovdBalance;

  @IsOptional()
  @IsNumber()
  performingBalance;

  @IsOptional()
  @IsNumber()
  periodicalPaymentAmount;

  @IsOptional()
  @IsNumber()
  prAmount;

  @IsOptional()
  @IsNumber()
  inAmount;

  @IsOptional()
  @IsNumber()
  peAmount;

  @IsOptional()
  @IsNumber()
  psAmount;

  @IsOptional()
  @IsNumber()
  ovdDays;

  @IsOptional()
  @IsDate()
  valueDate;

  @IsOptional()
  @IsDate()
  maturityDate;

  @IsOptional()
  @IsDate()
  ovdDate;

  @IsOptional()
  @IsNumber()
  dueDayOfMonth;

  @IsOptional()
  @IsNumber()
  bucket;

  @IsOptional()
  @IsString()
  @MaxLength(480)
  term;

  @IsOptional()
  @IsDate()
  transferDate: Date;

  @IsOptional()
  @IsDate()
  withDrawDate: Date;

  @IsOptional()
  @IsEnum(ContractStatus)
  status;

  @IsOptional()
  @IsNumber()
  interestRate;

  @IsOptional()
  @IsString()
  branchName;

  @IsOptional()
  @IsString()
  branchCode;

  @IsOptional()
  @IsString()
  accountNo;

  @IsOptional()
  @IsNumber()
  lastPaymentAmount;

  @IsOptional()
  @IsDate()
  lastPaymentDate;

  @IsOptional()
  @IsString()
  contractLink;

  @IsOptional()
  @IsNumber()
  ovdPeriod;

  @IsOptional()
  @IsString()
  statusOfLoan;
}
export class UpdateContractResult extends UpdateOneResult {
  @Expose()
  code = '';

  @Expose()
  partnerCode = '';

  @Expose()
  customerCode = '';

  @Expose()
  guid = '';

  @Expose()
  customerCIF = '';

  @Expose()
  productGroup = '';

  @Expose()
  originalBalance = 0;

  @Expose()
  TotalBalance = 0;

  @Expose()
  ovdBalance = 0;

  @Expose()
  performingBalance = 0;

  @Expose()
  periodicalPaymentAmount = 0;

  @Expose()
  prAmount = 0;

  @Expose()
  inAmount = 0;

  @Expose()
  peAmount = 0;

  @Expose()
  psAmount = 0;

  @Expose()
  ovdDays = 0;

  @Expose()
  valueDate = new Date();

  @Expose()
  maturityDate = new Date();

  @Expose()
  ovdDate = new Date();

  @Expose()
  dueDayOfMonth;

  @Expose()
  bucket = 0;

  @Expose()
  term = '';

  @Expose()
  transferDate: Date = new Date();

  @Expose()
  withDrawDate: Date = new Date();

  @Expose()
  status = '';

  @Expose()
  interestRate;

  @Expose()
  branchName;

  @Expose()
  branchCode;

  @Expose()
  accountNo;

  @Expose()
  lastPaymentAmount;

  @Expose()
  lastPaymentDate;

  @Expose()
  contractLink;

  @Expose()
  ovdPeriod;

  @Expose()
  statusOfLoan;
}
