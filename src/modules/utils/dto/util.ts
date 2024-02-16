import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';

export class CustomerData {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  callStaffCode: string;

  @IsOptional()
  @IsEnum({ Active: 'active', Closed: 'closed' })
  status: string;
}
