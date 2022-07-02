import { IsString, IsDate } from 'class-validator';

export class CreateData {}
export class CreateResult {
  @IsString()
  id = '';

  @IsDate()
  createdAt: Date;
}
