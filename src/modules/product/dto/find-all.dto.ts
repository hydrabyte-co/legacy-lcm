import {
  FindManyFilter as BaseFindAllFilter,
  FindAllResult as BaseFindAllResult,
} from '../../../common/modules/base/dto/find-many.dto';
import { Product } from '../entity/product.entity';

export class FindAllCategoriesFilter extends BaseFindAllFilter {}

export class FindAllCategoriesResult extends BaseFindAllResult<Product> {}
