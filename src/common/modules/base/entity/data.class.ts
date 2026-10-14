import { Exclude, Expose } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';
import { Permission } from 'src/common/types/data';

@Exclude()
export class DataHandler {
  @IsString() @IsOptional() @Expose() orgId = '';
  // appId
  @IsString() @IsOptional() @Expose() appId = '';
  // userId
  @IsString() @IsOptional() @Expose() userId = '';
  // staffCode
  @IsString() @IsOptional() @Expose() staffCode? = '';
  // scope
  @IsString() @IsOptional() @Expose() scope? = '';
  // role
  @IsString() @IsOptional() @Expose() role? = '';
  // roles
  @IsString() @IsOptional() @Expose() roles?: string[] = [];
  // access Token
  @IsString() @IsOptional() @Expose() accessToken? = '';
  // attributes
  @IsString() @IsOptional() @Expose() attributes?: any = {};
  // request
  @IsOptional() @Expose() request?: any = {};
  // response
  @IsOptional() @Expose() response?: any = {};
  // permission
  @IsOptional() @Expose() permission?: Permission;
}

@Exclude()
export class DataOwner {
  // orgId
  @IsString() @IsOptional() @Expose() orgId = '';
  // userId
  @IsString() @IsOptional() @Expose() userId = '';
}
