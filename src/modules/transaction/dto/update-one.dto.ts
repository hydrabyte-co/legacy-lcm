import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsDate,
  IsNumber,
} from 'class-validator';
import {
  UpdateOneData,
  UpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';

export class UpdateTransactionData extends UpdateOneData {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  customerCode = '';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  contractCode = '';

  @IsOptional()
  @IsNumber()
  amount = 0;

  @IsOptional()
  @IsDate()
  date: Date = new Date();
}
export class UpdateTransactionResult extends UpdateOneResult {
  @Expose()
  customerCode = '';

  @Expose()
  contractCode = '';

  @Expose()
  amount = 0;

  @Expose()
  date = new Date();
}
