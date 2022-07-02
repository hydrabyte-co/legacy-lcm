import { IsArray, IsObject } from 'class-validator';
import { Filter } from '../constant/base.const';

export class FindAllFilter {
  @IsObject()
  where: object = {};

  @IsObject()
  order: object = {};

  @IsObject()
  pagination: {
    index: number;
    size: number;
  } = {
    index: Filter.PageIndex,
    size: Filter.PageSize,
  };
}

export class FindAllResult {
  @IsArray()
  data: object[] = [];

  @IsObject()
  pagination: {
    index: number;
    size: number;
    totalPages: number;
    totalItems: number;
  } = {
    index: Filter.PageIndex,
    size: Filter.PageSize,
    totalPages: 0,
    totalItems: 0,
  };
}
