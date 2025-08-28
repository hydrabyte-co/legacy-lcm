import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindDataHandlerByIdResult extends BaseFindByIdResult {
  @Expose()
  name = '';

  @Expose()
  description = '';

  @Expose()
  type = '';

  @Expose()
  partnerCode = '';

  @Expose()
  staffCode = '';

  @Expose()
  status = '';

  @Expose()
  sourceType = '';

  @Expose()
  targetType = '';

  @Expose()
  filePath = '';

  @Expose()
  fileName = '';

  @Expose()
  fileSize = 0;

  @Expose()
  expectedRecords = 0;

  @Expose()
  processedRecords = 0;

  @Expose()
  errorRecords = 0;

  @Expose()
  startTime = new Date();

  @Expose()
  endTime = new Date();

  @Expose()
  duration = 0;

  @Expose()
  errorLog = '';

  @Expose()
  notes = '';
}