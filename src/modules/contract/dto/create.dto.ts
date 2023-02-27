import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
  IsDate,
  IsOptional,
  IsDateString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { ContractStatus } from '../enum/contract.enum';

export class CreateContractData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  code = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  partnerCode = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  customerCode = '';

  @IsString()
  @MaxLength(36)
  guid = '';

  @IsString()
  @MaxLength(36)
  customerCIF = '';

  @IsString()
  @MaxLength(36)
  productGroup = '';

  @IsNumber()
  originalBalance = 0;

  @IsNumber()
  TotalBalance = 0;

  @IsNumber()
  ovdBalance = 0;

  @IsNumber()
  performingBalance = 0;

  @IsNumber()
  periodicalPaymentAmount = 0;

  @IsNumber()
  prAmount = 0;

  @IsNumber()
  inAmount = 0;

  @IsNumber()
  peAmount = 0;

  @IsNumber()
  psAmount = 0;

  @IsNumber()
  ovdDays = 0;

  @IsDateString()
  valueDate = new Date();

  @IsDateString()
  maturityDate = new Date();

  @IsDateString()
  ovdDate = new Date();

  @IsNumber()
  dueDayOfMonth;

  @IsNumber()
  bucket = 0;

  @IsString()
  @MaxLength(480)
  term = '';

  @IsDateString()
  transferDate: Date = new Date();

  @IsDateString()
  withDrawDate: Date = new Date();

  @IsEnum(ContractStatus)
  status = ContractStatus.Active;

  @IsNumber()
  interestRate = 0;

  @IsString()
  branchName = '';

  @IsString()
  branchCode = '';

  @IsString()
  accountNo = '';

  @IsNumber()
  lastPaymentAmount = 0;

  @IsDate()
  lastPaymentDate;

  @IsString()
  contractLink = '';

  @IsNumber()
  ovdPeriod;

  @IsString()
  statusOfLoan;
}
@Exclude()
export class CreateContractResult extends BaseCreateResult {
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
