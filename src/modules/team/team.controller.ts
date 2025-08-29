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
import { TeamService } from './team.service';
import { CreateTeamData } from './dto/create.dto';
import { UpdateTeamData } from './dto/update-one.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { Services } from 'src/common/enums/services';
import { Resources } from 'src/common/enums/resources';
import { Team } from './entity/team.entity';
import { DeleteOneResult } from 'src/common/types/controller-dto';
import { Request } from 'express';

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
