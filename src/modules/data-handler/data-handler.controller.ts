import {
  Controller,
  Post,
  Query,
  Req,
  UseGuards
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
import { DataHandlerService } from './data-handler.service';

@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.LCM_DataHandler)
@Controller(Resources.LCM_DataHandler)
export class DataHandlerController {
  constructor(private readonly dataHandlerService: DataHandlerService) {}

  @Post('/process-customer-data')
  //@UseGuards(AuthGuard, RolesGuard)
  async processCustomerData(
    //@Body() data: CreateCustomerData,
    @Req() req: Request,
  ): Promise<any> {
    return await this.dataHandlerService.processCustomerData(req.user as DataHandler);
  }

  @Post('/query-contacts')
  @UseGuards(AuthGuard, RolesGuard)
  async findContacts(@Query() query, @Req() req: Request): Promise<any[]> {
    return await this.dataHandlerService.queryContacts(query, req.user as DataHandler);
  }
}
