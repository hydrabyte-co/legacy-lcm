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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import {
  ServiceInfo,
  ControllerInfo,
} from 'src/common/decorators/service-info';
import { CustomerService } from './customer.service';
import { CreateCustomerData, CreateCustomerResult } from './dto/create.dto';
import { UpdateCustomerData, UpdateCustomerResult } from './dto/update-one.dto';
import { FindCustomerByIdResult } from './dto/find-one.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { Services } from 'src/common/enums/services';
import { Resources } from 'src/common/enums/resources';
import { Customer } from './entity/customer.entity';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { Request } from 'express';

@ApiTags('Customers')
@ApiBearerAuth('JWT-auth')
@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.LCM_Customers)
@Controller(Resources.LCM_Customers)
export class CustomersController extends BaseController {
  constructor(private readonly customersService: CustomerService) {
    super(customersService);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Create new debt customer',
    description: 'Create a new customer record for debt collection management' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Customer created successfully',
    type: CreateCustomerResult 
  })
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async createOne(
    @Body() data: CreateCustomerData,
    @Req() req: Request,
  ): Promise<CreateCustomerResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<FindCustomerByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req: Request,
  ): Promise<FindAllResult<Customer>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateCustomerData,
    @Req() req: Request,
  ): Promise<UpdateCustomerResult> {
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async deleteOne(@Param('id') id: string, @Req() req: Request) {
    return await super.deleteOne(id, req);
  }
}
