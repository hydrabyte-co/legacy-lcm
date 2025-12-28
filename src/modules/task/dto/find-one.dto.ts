import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindTaskByIdResult extends BaseFindByIdResult {
  @Expose()
  customerCode = '';

  @Expose()
  staffCode = '';

  @Expose()
  partnerCode = '';

  @Expose()
  taskType = '';

  @Expose()
  title = '';

  @Expose()
  description = '';

  @Expose()
  priority = '';

  @Expose()
  status = '';

  @Expose()
  assignedDate = new Date();

  @Expose()
  dueDate = new Date();

  @Expose()
  completedDate = new Date();

  @Expose()
  notes = '';
}