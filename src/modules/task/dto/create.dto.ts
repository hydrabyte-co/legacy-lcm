import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { CreateData as BaseCreateData } from '../../../common/modules/base/dto/create.dto';

export class CreateTaskData extends BaseCreateData {
  @IsMongoId()
  @IsNotEmpty()
  assignerId = '';

  @IsMongoId()
  @IsNotEmpty()
  assigneeId = '';

  @IsNotEmpty()
  summary = '';
}
