import { IsString, IsDate } from 'class-validator';
export class DeleteByIdResult {
  @IsString()
  id = '';

  @IsDate()
  changedAt: Date;
}
