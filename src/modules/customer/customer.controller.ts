import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ControllerInfo, ServiceInfo } from '../../common/decorators/service-info';
import { Resources } from '../../common/enums/resources';
import { Services } from '../../common/enums/services';
import { RolesGuard } from '../../common/guards/auth/roles.guard';
import { BaseController } from '../../common/modules/base/base.controller';
import { FindAllResult } from '../../common/modules/base/dto/find-many.dto';
import { CustomerService } from './customer.service';
import { CreateCustomerData, CreateCustomerResult } from './dto/create.dto';
import { FindCustomerByIdResult } from './dto/find-one.dto';
import { UpdateCustomerData, UpdateCustomerResult } from './dto/update-one.dto';
import { Customer } from './entity/customer.entity';


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
