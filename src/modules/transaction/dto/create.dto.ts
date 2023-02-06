import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
  IsDate,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';

export class CreateTransactionData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  customerCode = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  contractCode = '';

  @IsNumber()
  amount = 0;

  @IsDateString()
  date: Date = new Date();
}
@Exclude()
export class CreateTransactionResult extends BaseCreateResult {
  @Expose()
  customerCode = '';

  @Expose()
  contractCode = '';

  @Expose()
  amount = 0;

  @Expose()
  date = new Date();
}
