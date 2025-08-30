import { IsNotEmpty, IsObject } from 'class-validator';
import { CreateData as BaseCreateData } from '../../../common/modules/base/dto/create.dto';
import { BasicObject } from '../../../common/types/data';

export class CreateTaskData extends BaseCreateData {
  @IsObject()
  @IsNotEmpty()
  assigner: {
    userId: string;
    staffCode: string;
  } = {
    userId: '',
    staffCode: '',
  };

  @IsObject()
  @IsNotEmpty()
  assignee: {
    userId: string;
    staffCode: string;
  } = {
    userId: '',
    staffCode: '',
  };

  @IsNotEmpty()
  summary = '';

  @IsObject()
  @IsNotEmpty()
  data: BasicObject = {};
}
