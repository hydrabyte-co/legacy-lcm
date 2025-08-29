import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { Request } from 'express';
import {
  ControllerInfo,
  ServiceInfo,
} from 'src/common/decorators/service-info';
import { Resources } from 'src/common/enums/resources';
import { Services } from 'src/common/enums/services';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import {
  UpdateTransactionResult
} from '../transaction/dto/update-one.dto';
import { CustomerData, OriginateAutoCallData } from './dto/util';
import { UtilService } from './utils.service';

@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.Util)
@Controller(Resources.Util)
export class UtilController {
  constructor(private readonly utilService: UtilService) {}

  @Post('/update-customers')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateCustomers(
    @Body() data: CustomerData[],
    @Req() req: Request,
  ): Promise<UpdateTransactionResult> {
    if (Array.isArray(data)) {
      return this.utilService.updateCustomers(data, req.user as DataHandler);
    } else {
      throw new BadRequestException({ messages: ['invalid customers data'] });
    }
  }

  @Post('/originate-auto-call')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async originateAutoCall(
    @Body() data: OriginateAutoCallData,
    @Req() req: Request,
  ): Promise<any> {
    return this.utilService.originateAutoCall(data, req.user as DataHandler);
  }
}
