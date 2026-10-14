import { IsString, IsDate } from 'class-validator';

export class UpdateOneData {}
export class UpdateData extends UpdateOneData {}
export class UpdateOneResult {
  @IsString()
  id = '';

  @IsDate()
  changedAt: Date;
}
