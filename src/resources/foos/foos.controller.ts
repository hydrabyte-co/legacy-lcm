import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Request,
  Query,
  Optional,
} from '@nestjs/common';
import { ServiceAuthGuard } from 'src/common/guards/auth/auth.guard';
import {
  handleClassValidation,
  handleMongoDBObjectIdValidation,
} from 'src/common/utils/validator-helper';
import { FoosService } from './foos.service';
import { CreateFooDTO } from './dto/create.dto';
import { UpdateFooDTO } from './dto/update.dto';
import { Foo } from './entities/foo.entity';
import { Status } from './enums/foo.enum';
import { Filter } from '../../common/modules/base/enum/base.enum';

@Controller('foos')
export class FoosController {
  constructor(private readonly foosService: FoosService) {}

  @Post()
  async create(@Body() createFooDTO: CreateFooDTO): Promise<Foo> {
    const validationResult = await handleClassValidation(createFooDTO);
    if (validationResult) {
      throw validationResult;
    }
    return this.foosService.create(createFooDTO);
  }

  @Get()
  @UseGuards(ServiceAuthGuard)
  async findAll(
    @Query('name') @Optional() name: string,
    @Query('status') @Optional() status: Status,
    @Query('pageIndex') @Optional() pageIndex: number,
    @Query('pageSize') @Optional() pageSize: number,
  ): Promise<Foo[]> {
    const filterObject: {
      order: object;
      where: {
        name?: RegExp;
        status?: string;
      };
      take: number;
      skip: number;
    } = {
      order: { createdAt: 'DESC' },
      where: {},
      take: Filter.PageSize * 1,
      skip: Filter.PageIndex * Filter.PageSize,
    };
    if (name) {
      filterObject.where.name = new RegExp(`${name}`);
    }
    if (status) {
      filterObject.where.status = status;
    }
    if (pageSize <= 0 || pageSize >= Filter.MaxPageSize) {
      pageSize = Filter.PageSize;
    }
    if (pageIndex >= 0) {
      filterObject.take = pageSize * 1;
      filterObject.skip = pageIndex * pageSize;
    }
    console.log(filterObject, pageSize);

    return await this.foosService.findAll(filterObject);
  }

  @Get(':id')
  @UseGuards(ServiceAuthGuard)
  async findOne(@Param('id') id: string): Promise<Foo> {
    const validateResult = handleMongoDBObjectIdValidation(id);
    if (validateResult) {
      throw validateResult;
    }
    return await this.foosService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(ServiceAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePhonefooDto: UpdateFooDTO,
  ) {
    const validateResult = handleMongoDBObjectIdValidation(id);
    if (validateResult) {
      throw validateResult;
    }
    return await this.foosService.update(id, updatePhonefooDto);
  }

  @Delete(':id')
  @UseGuards(ServiceAuthGuard)
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const validateResult = handleMongoDBObjectIdValidation(id);
    if (validateResult) {
      throw validateResult;
    }
    return await this.foosService.remove(id);
  }
}
