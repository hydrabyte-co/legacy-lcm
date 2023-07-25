import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class FindPerformanceByIdResult extends BaseFindByIdResult {
  @Expose()
  year;

  @Expose()
  month;

  @Expose()
  staffCode = '';

  @Expose()
  targets = [];

  @Expose()
  results = [];
}
