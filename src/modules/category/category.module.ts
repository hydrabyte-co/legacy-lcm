import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoriesController } from './category.controller';
import { Category } from './entity/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoryService],
})
export class CategoryModule {}
