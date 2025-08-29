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
import { ReportService } from './report.service';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { Services } from 'src/common/enums/services';
import { Resources } from 'src/common/enums/resources';
import { UpdateTransactionResult } from '../transaction/dto/update-one.dto';
import { CustomerData } from './dto/report';
import { Request } from 'express';

@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.Report)
@Controller(Resources.Report)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('/customers-summary')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async customerSummaryReport(
    @Body() data: CustomerData[],
    @Req() req: Request,
  ): Promise<any> {
    const handler = req.user || new DataHandler();
    return this.reportService.customerSummaryReport(handler);
  }

  @Get('/debt-collection-by-bank')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async debtCollectionByBankReport(
    @Body() data: CustomerData[],
    @Req() req: Request,
  ): Promise<any> {
    const handler = req.user || new DataHandler();
    return this.reportService.debtCollectionByBank(handler);
  }

  @Get('/debt-collection-by-staff')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async debtCollectionByStaffReport(
    @Body() data: CustomerData[],
    @Req() req: Request,
  ): Promise<any> {
    const handler = req.user || new DataHandler();
    return this.reportService.debtCollectionByStaff(handler);
  }

  @Get('/tasks-summary')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async tasksSummaryReport(
    @Body() data: CustomerData[],
    @Req() req: Request,
  ): Promise<any> {
    const handler = req.user || new DataHandler();
    return this.reportService.tasksSummaryReport(handler);
  }
}
