import {
  IsArray,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { UpdateOneData } from '../../../common/modules/base/dto/update-one.dto';
import { TeamStatuses } from '../../../enums';

export class UpdateTeamData extends UpdateOneData {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumberString()
  @IsOptional()
  leaderStaffCode: string;

  @IsArray()
  @IsOptional()
  memberStaffCodes: string[];

  @IsOptional()
  @IsEnum(TeamStatuses)
  status: string;
}
