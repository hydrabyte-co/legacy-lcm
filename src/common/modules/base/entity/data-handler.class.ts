import { IsString, IsOptional } from 'class-validator';

export class DataHandler {
  // orgId
  @IsString() @IsOptional() orgId: string;
  // appId
  @IsString() @IsOptional() appId: string;
  // userId
  @IsString() @IsOptional() userId: string;
}
