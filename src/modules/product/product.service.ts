import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Product } from './entity/product.entity';
import { BaseService } from 'src/common/modules/base/base.service';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { Category } from '../category/entity/category.entity';
import { CreateProductData } from './dto/create.dto';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: MongoRepository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: MongoRepository<Category>,
  ) {
    super(productRepository);
  }

  async createOne(data: CreateProductData, handler: DataHandler): Promise<any> {
    return super.createOne(data, handler);
  }
}
