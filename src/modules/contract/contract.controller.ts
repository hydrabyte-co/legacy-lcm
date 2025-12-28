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
import { Request } from 'express';
import { ControllerInfo, ServiceInfo } from '../../common/decorators/service-info';
import { Resources } from '../../common/enums/resources';
import { Services } from '../../common/enums/services';
import { RolesGuard } from '../../common/guards/auth/roles.guard';
import { BaseController } from '../../common/modules/base/base.controller';
import { FindAllResult } from '../../common/modules/base/dto/find-many.dto';
import { ContractService } from './contract.service';
import { CreateContractData, CreateContractResult } from './dto/create.dto';
import { FindContractByIdResult } from './dto/find-one.dto';
import { UpdateContractData, UpdateContractResult } from './dto/update-one.dto';
import { Contract } from './entity/contract.entity';

@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.LCM_Contracts)
@Controller(Resources.LCM_Contracts)
export class ContractsController extends BaseController {
  constructor(private readonly contractsService: ContractService) {
    super(contractsService);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async createOne(
    @Body() data: CreateContractData,
    @Req() req: Request,
  ): Promise<CreateContractResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<FindContractByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req: Request,
  ): Promise<FindAllResult<Contract>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateContractData,
    @Req() req: Request,
  ): Promise<UpdateContractResult> {
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async deleteOne(@Param('id') id: string, @Req() req: Request) {
    return await super.deleteOne(id, req);
  }
}
