import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';

export class PartnerInfoDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}

export class StaffInfoDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  staffCode: string;
}

export class AutoDialerConfigDto {
  @ValidateNested()
  @Type(() => PartnerInfoDto)
  partner: PartnerInfoDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => StaffInfoDto)
  staffs: StaffInfoDto[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  phoneNumbers: string[];

  @IsNumber()
  @Min(1)
  @Max(10)
  retryAttempts: number;

  @IsNumber()
  @Min(0.5)
  @Max(2.0)
  concurrentCallRatio: number;
}
