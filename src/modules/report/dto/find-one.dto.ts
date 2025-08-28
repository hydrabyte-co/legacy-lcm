import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindReportByIdResult extends BaseFindByIdResult {
  @Expose()
  name = '';

  @Expose()
  description = '';

  @Expose()
  type = '';

  @Expose()
  format = '';

  @Expose()
  status = '';

  @Expose()
  partnerCode = '';

  @Expose()
  staffCode = '';

  @Expose()
  teamCode = '';

  @Expose()
  fromDate = '';

  @Expose()
  toDate = '';

  @Expose()
  filters = [];

  @Expose()
  groupBy = [];

  @Expose()
  columns = [];

  @Expose()
  totalRecords = 0;

  @Expose()
  processedRecords = 0;

  @Expose()
  filePath = '';

  @Expose()
  fileName = '';

  @Expose()
  fileSize = 0;

  @Expose()
  generateTime = 0;

  @Expose()
  errorMessage = '';

  @Expose()
  downloadCount = 0;

  @Expose()
  expiryDate = new Date();

  @Expose()
  notes = '';
}