import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import {
    ControllerInfo,
    ServiceInfo,
} from '../../common/decorators/service-info';
import { Resources } from '../../common/enums/resources';
import { Services } from '../../common/enums/services';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { RolesGuard } from '../../common/guards/auth/roles.guard';
import { BaseController } from '../../common/modules/base/base.controller';
import { FindAllResult } from '../../common/modules/base/dto/find-many.dto';
import { DeleteOneResult } from '../../common/types/controller-dto';
import { CreateTeamData } from './dto/create.dto';
import { UpdateTeamData } from './dto/update-one.dto';
import { Team } from './entity/team.entity';
import { TeamService } from './team.service';

@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.LCM_Team)
@Controller(Resources.LCM_Team)
export class TeamController extends BaseController {
  constructor(private readonly UpdatesService: TeamService) {
    super(UpdatesService);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async createOne(@Body() data: CreateTeamData, @Req() req: Request): Promise<Team> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async findOne(@Param('id') id: string, @Req() req: Request): Promise<Team> {
    return await super.findOne(id, req);
  }

  @Get()
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req: Request,
  ): Promise<FindAllResult<Team>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateTeamData,
    @Req() req: Request,
  ): Promise<Team> {
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async deleteOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<DeleteOneResult> {
    return await super.deleteOne(id, req);
  }
}
