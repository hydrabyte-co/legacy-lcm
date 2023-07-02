import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import {
  ServiceInfo,
  ControllerInfo,
} from 'src/common/decorators/service-info';
import { DataHandlerService } from './data-handler.service';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';

@ServiceInfo(Services.LCM)
@ControllerInfo(Controllers.LCM_DataHandler)
@Controller(Controllers.LCM_DataHandler)
export class DataHandlerController {
  constructor(private readonly dataHandlerService: DataHandlerService) {}

  @Post('/process-customer-data')
  //@UseGuards(AuthGuard, RolesGuard)
  async processCustomerData(
    //@Body() data: CreateCustomerData,
    @Req() req,
  ): Promise<any> {
    const handler = req.user || new DataHandler();
    return await this.dataHandlerService.processCustomerData(handler);
  }

  @Post('/query-contacts')
  @UseGuards(AuthGuard, RolesGuard)
  async findContacts(@Query() query, @Req() req): Promise<any[]> {
    const handler = req.user || new DataHandler();
    console.log(query);

    return await this.dataHandlerService.queryContacts(query, handler);
  }
}
