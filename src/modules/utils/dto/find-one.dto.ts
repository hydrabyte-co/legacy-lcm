import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindUtilByIdResult extends BaseFindByIdResult {
  @Expose()
  name = '';

  @Expose()
  description = '';

  @Expose()
  type = '';

  @Expose()
  status = '';

  @Expose()
  partnerCode = '';

  @Expose()
  staffCode = '';

  @Expose()
  operation = '';

  @Expose()
  parameters = [];

  @Expose()
  inputData = '';

  @Expose()
  outputData = '';

  @Expose()
  executionTime = 0;

  @Expose()
  startTime = new Date();

  @Expose()
  endTime = new Date();

  @Expose()
  errorMessage = '';

  @Expose()
  retryCount = 0;

  @Expose()
  notes = '';
}