import { IsOptional, IsString } from 'class-validator';
import { UpdateOneData } from '../../../common/modules/base/dto/update-one.dto';

export class UpdateTaskData extends UpdateOneData {
  @IsString()
  @IsOptional()
  name;

  @IsString()
  @IsOptional()
  body;
}
