import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindExportDataByIdResult extends BaseFindByIdResult {
  @Expose()
  fileId;

  @Expose()
  datasources;

  @Expose()
  outputFileType;

  @Expose()
  error;

  @Expose()
  note;

  @Expose()
  status;
}
