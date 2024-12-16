import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Team } from './entity/team.entity';
import { BaseService } from 'src/common/modules/base/base.service';

@Injectable()
export class TeamService extends BaseService<Team> {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepo: MongoRepository<Team>,
  ) {
    super(teamRepo);
  }
}
