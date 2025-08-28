import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindEventByIdResult extends BaseFindByIdResult {
  @Expose()
  name = '';

  @Expose()
  description = '';

  @Expose()
  type = '';

  @Expose()
  priority = '';

  @Expose()
  status = '';

  @Expose()
  partnerCode = '';

  @Expose()
  customerCode = '';

  @Expose()
  staffCode = '';

  @Expose()
  moduleCode = '';

  @Expose()
  action = '';

  @Expose()
  details = '';

  @Expose()
  scheduledDate = new Date();

  @Expose()
  processedDate = new Date();

  @Expose()
  executionTime = 0;

  @Expose()
  result = '';

  @Expose()
  errorMessage = '';

  @Expose()
  retryCount = 0;

  @Expose()
  notes = '';
}