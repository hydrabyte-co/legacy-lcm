import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import {
  ServiceInfo,
  ControllerInfo,
} from 'src/common/decorators/service-info';
import { ProductService } from './product.service';
import { CreateProductData, CreateProductResult } from './dto/create.dto';
import { UpdateCategoryData } from './dto/update-one.dto';
import { FindCategoryByIdResult } from './dto/find-one.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';

@ServiceInfo(Services.Template)
@ControllerInfo(Controllers.Template_Products)
@Controller(Controllers.Template_Products)
export class ProductController extends BaseController {
  constructor(private readonly categoriesService: ProductService) {
    super(categoriesService);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createOne(
    @Body() data: CreateProductData,
    @Req() req,
  ): Promise<CreateProductResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(
    @Param('id') id: string,
    @Req() req,
  ): Promise<FindCategoryByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req,
  ): Promise<FindAllResult<any>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateCategoryData,
    @Req() req,
  ) {
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async deleteOne(@Param('id') id: string, @Req() req) {
    return await super.deleteOne(id, req);
  }
}
