import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';

export class CreatePerformanceData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  staffCode = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  partnerCode = '';

  @IsString()
  @MaxLength(24)
  teamCode = '';

  @IsDateString()
  @IsNotEmpty()
  reportDate = '';

  @IsNumber()
  @IsOptional()
  totalCalls = 0;

  @IsNumber()
  @IsOptional()
  successfulCalls = 0;

  @IsNumber()
  @IsOptional()
  totalCollection = 0;

  @IsNumber()
  @IsOptional()
  targetAmount = 0;

  @IsNumber()
  @IsOptional()
  achievedAmount = 0;

  @IsNumber()
  @IsOptional()
  callDuration = 0;

  @IsNumber()
  @IsOptional()
  customerReached = 0;

  @IsNumber()
  @IsOptional()
  promiseToPay = 0;

  @IsNumber()
  @IsOptional()
  actualPayments = 0;

  @IsString()
  @MaxLength(500)
  notes = '';
}

@Exclude()
export class CreatePerformanceResult extends BaseCreateResult {
  @Expose()
  staffCode = '';

  @Expose()
  partnerCode = '';

  @Expose()
  teamCode = '';

  @Expose()
  reportDate = '';

  @Expose()
  totalCalls = 0;

  @Expose()
  successfulCalls = 0;

  @Expose()
  totalCollection = 0;

  @Expose()
  targetAmount = 0;

  @Expose()
  achievedAmount = 0;

  @Expose()
  performanceRate = 0;

  @Expose()
  callDuration = 0;

  @Expose()
  customerReached = 0;

  @Expose()
  promiseToPay = 0;

  @Expose()
  actualPayments = 0;

  @Expose()
  notes = '';
}