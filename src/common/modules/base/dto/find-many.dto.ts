import { IsArray, IsObject } from 'class-validator';
import { Filter } from '../constant/base.const';

export class FindManyFilter {
  @IsArray()
  select: string[] = [];

  @IsObject()
  where: {
    [key: string]: any;
  } = {};

  @IsObject()
  order: {
    [key: string]: any;
  } = {};

  @IsObject()
  paging: {
    index: number;
    size: number;
  } = {
    index: Filter.PageIndex,
    size: Filter.PageSize,
  };
}

export class FindAllResult<T> {
  @IsArray()
  data: T[] = [];

  @IsObject()
  paging: {
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

  @IsObject()
  statistics: {
    total: number;
    [key: string]: any;
  } = {
    total: 0,
  };
}

export class FindTopData<T> {
  @IsArray()
  data: T[] = [];
}
