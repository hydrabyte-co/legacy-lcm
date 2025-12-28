import { IsOptional, IsString, MaxLength, IsNumber, IsDateString } from 'class-validator';
import { UpdateData as BaseUpdateData } from '../../../common/modules/base/dto/update-one.dto';

export class UpdatePerformanceData extends BaseUpdateData {
  @IsOptional()
  @IsString()
  @MaxLength(24)
  staffCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  partnerCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  teamCode?: string;

  @IsOptional()
  @IsDateString()
  reportDate?: string;

  @IsOptional()
  @IsNumber()
  totalCalls?: number;

  @IsOptional()
  @IsNumber()
  successfulCalls?: number;

  @IsOptional()
  @IsNumber()
  totalCollection?: number;

  @IsOptional()
  @IsNumber()
  targetAmount?: number;

  @IsOptional()
  @IsNumber()
  achievedAmount?: number;

  @IsOptional()
  @IsNumber()
  callDuration?: number;

  @IsOptional()
  @IsNumber()
  customerReached?: number;

  @IsOptional()
  @IsNumber()
  promiseToPay?: number;

  @IsOptional()
  @IsNumber()
  actualPayments?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}