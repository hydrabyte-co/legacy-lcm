import {
  Body,
  Controller,
  Get,
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
import { CustomerData } from './dto/report';
import { ReportService } from './report.service';

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
    
    return this.reportService.customerSummaryReport(req.user as DataHandler);
  }

  @Get('/debt-collection-by-bank')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async debtCollectionByBankReport(
    @Body() data: CustomerData[],
    @Req() req: Request,
  ): Promise<any> {
    
    return this.reportService.debtCollectionByBank(req.user as DataHandler);
  }

  @Get('/debt-collection-by-staff')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async debtCollectionByStaffReport(
    @Body() data: CustomerData[],
    @Req() req: Request,
  ): Promise<any> {
    
    return this.reportService.debtCollectionByStaff(req.user as DataHandler);
  }

  @Get('/tasks-summary')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async tasksSummaryReport(
    @Body() data: CustomerData[],
    @Req() req: Request,
  ): Promise<any> {
    
    return this.reportService.tasksSummaryReport(req.user as DataHandler);
  }
}
