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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ControllerInfo } from '../../common/decorators/service-info';
import { Resources } from '../../common/enums/resources';
import { Services } from '../../common/enums/services';
import { RolesGuard } from '../../common/guards/auth/roles.guard';
import { BaseController } from '../../common/modules/base/base.controller';
import { FindAllResult } from '../../common/modules/base/dto/find-many.dto';
import { CreatePartnerData, CreatePartnerResult } from './dto/create.dto';
import { FindPartnerByIdResult } from './dto/find-one.dto';
import { UpdatePartnerData, UpdatePartnerResult } from './dto/update-one.dto';
import { Partner } from './entity/partner.entity';
import { PartnerService } from './partner.service';

@ApiTags('Partners')
@ApiBearerAuth('JWT-auth')
@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.LCM_Partners)
@Controller(Resources.LCM_Partners)
export class PartnersController extends BaseController {
  constructor(private readonly partnersService: PartnerService) {
    super(partnersService);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async createOne(
    @Body() data: CreatePartnerData,
    @Req() req: Request,
  ): Promise<CreatePartnerResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<FindPartnerByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req: Request,
  ): Promise<FindAllResult<Partner>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async updateOne(
    @Param('id') id: string,
    @Body() data: UpdatePartnerData,
    @Req() req: Request,
  ): Promise<UpdatePartnerResult> {
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async deleteOne(@Param('id') id: string, @Req() req: Request) {
    return await super.deleteOne(id, req);
  }
}

function ServiceInfo(LCM: Services): (target: typeof PartnersController) => void | typeof PartnersController {
  return (target: typeof PartnersController) => {
    console.log(`ServiceInfo decorator applied with LCM: ${LCM}`);
    // Implement the logic for the ServiceInfo decorator
    // You can use the LCM parameter as needed
  };
}

