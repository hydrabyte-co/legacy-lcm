import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Category } from './entity/category.entity';
import { BaseService } from 'src/common/modules/base/base.service';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: MongoRepository<Category>,
  ) {
    super(categoriesRepository);
  }
}
