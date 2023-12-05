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
import { Controllers } from 'src/common/enums/controllers';

@ServiceInfo(Services.LCM)
@ControllerInfo(Controllers.Util)
@Controller(Controllers.Util)
export class UtilController {
  constructor(private readonly utilService: UtilService) {}
}
