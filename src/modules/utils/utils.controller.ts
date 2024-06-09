import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Header,
  UseGuards,
  Patch,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import {
  ServiceInfo,
  ControllerInfo,
} from 'src/common/decorators/service-info';
import { UtilService } from './utils.service';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { Services } from 'src/common/enums/services';
import { Resources } from 'src/common/enums/resources';
import {
  UpdateTransactionData,
  UpdateTransactionResult,
} from '../transaction/dto/update-one.dto';
import { CustomerData, OriginateAutoCallData } from './dto/util';

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
    @Req() req,
  ): Promise<UpdateTransactionResult> {
    const handler = req.user || new DataHandler();
    if (Array.isArray(data)) {
      return this.utilService.updateCustomers(data, handler);
    } else {
      throw new BadRequestException({ messages: ['invalid customers data'] });
    }
  }

  @Post('/originate-auto-call')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async originateAutoCall(
    @Body() data: OriginateAutoCallData,
    @Req() req,
  ): Promise<any> {
    const handler = req.user || new DataHandler();
    return this.utilService.originateAutoCall(data, handler);
  }
}
