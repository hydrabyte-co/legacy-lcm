import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsOptional,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export class RequestMobileNumberData {
  @IsString()
  @IsNotEmpty()
  appCode: string;

  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsString()
  @IsNotEmpty()
  requestToken: string;
}

export class GetCodeData {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  requestId: string;

  @IsString()
  @IsNotEmpty()
  requestToken: string;
}

export class RequestMobileNumbersResult {
  @Expose()
  id = '';

  @Expose()
  requestId = '';

  @Expose()
  clientId = '';

  @Expose()
  appCode = '';

  @Expose()
  number = '';

  @Expose()
  requestAt;

  @Expose()
  status;
}

export class GetCodeResult {
  @Expose()
  requestId = '';

  @Expose()
  clientId = '';

  @Expose()
  appCode = '';

  @Expose()
  number = '';

  @Expose()
  content = '';

  @Expose()
  requestAt;

  @Expose()
  receivedAt;

  @Expose()
  status;
}
