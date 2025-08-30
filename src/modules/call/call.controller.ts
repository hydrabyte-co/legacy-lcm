import {
  Controller,
  Get,
  Query,
  Req
} from '@nestjs/common';
import { Request } from 'express';
import { ControllerInfo, ServiceInfo } from '../../common/decorators/service-info';
import { Resources } from '../../common/enums/resources';
import { Services } from '../../common/enums/services';
import { BaseController } from '../../common/modules/base/base.controller';
import { FindAllResult } from '../../common/modules/base/dto/find-many.dto';
import { CallService } from './call.service';
import { Call } from './entity/call.entity';

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
    @Req() req: Request,
  ): Promise<FindAllResult<Call>> {
    return await super.findManyWithPaging(queries, req);
  }
}
