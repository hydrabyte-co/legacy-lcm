import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from '../../common/modules/base/base.service';
import { Team } from './entity/team.entity';

@Injectable()
export class TeamService extends BaseService<Team> {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepo: MongoRepository<Team>,
  ) {
    super(teamRepo);
  }
}
