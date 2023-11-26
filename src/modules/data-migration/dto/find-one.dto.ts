import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindDataMigrationByIdResult extends BaseFindByIdResult {
  @Expose()
  collectionName;

  @Expose()
  filter;

  @Expose()
  results;

  @Expose()
  error;

  @Expose()
  note;

  @Expose()
  status;
}
