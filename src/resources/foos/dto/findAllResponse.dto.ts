import { MaxLength, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class FinAllResponse {
  @IsString()
  @MaxLength(18)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(180)
  @IsOptional()
  note?: string = '';

  @IsOptional()
  isActive?: boolean = false;
}
