import {
  FindManyFilter as BaseFindAllFilter,
  FindAllResult as BaseFindAllResult,
} from '../../../common/modules/base/dto/find-many.dto';
import { Category } from '../entity/category.entity';

export class FindAllCategoriesFilter extends BaseFindAllFilter {}

export class FindAllCategoriesResult extends BaseFindAllResult<Category> {}
