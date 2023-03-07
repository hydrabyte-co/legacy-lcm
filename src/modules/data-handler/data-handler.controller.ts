import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DataHandlerService } from './data-handler.service';
import { DataHandler } from 'src/common/modules/base/entity/data.class';

@Controller('data-handler')
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
}
