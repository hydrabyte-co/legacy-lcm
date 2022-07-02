import { IsString, IsDate } from 'class-validator';

export class UpdateData {}
export class UpdateResult {
  @IsString()
  id = '';

  @IsDate()
  changedAt: Date;
}
