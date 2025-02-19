import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import {
  ServiceInfo,
  ControllerInfo,
} from 'src/common/decorators/service-info';
import { CallService } from './call.service';
import { CreateCallData } from './dto/create.dto';
import { UpdateCallData } from './dto/update-one.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { Services } from 'src/common/enums/services';
import { Resources } from 'src/common/enums/resources';
import { Call } from './entity/call.entity';
import { DeleteOneResult } from 'src/common/types/controller-dto';

@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.VSM_Calls)
@Controller(Resources.VSM_Calls)
export class CallController extends BaseController {
  constructor(private readonly UpdatesService: CallService) {
    super(UpdatesService);
  }

  @Get()
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req,
  ): Promise<FindAllResult<Call>> {
    return await super.findManyWithPaging(queries, req);
  }
}
