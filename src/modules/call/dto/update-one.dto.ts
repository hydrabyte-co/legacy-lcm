import { IsOptional } from 'class-validator';
import { UpdateOneData } from '../../../common/modules/base/dto/update-one.dto';

export class UpdateCallData extends UpdateOneData {
  @IsOptional()
  summary = '';
}
