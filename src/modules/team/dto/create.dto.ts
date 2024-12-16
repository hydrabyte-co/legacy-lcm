import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsEnum,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { CreateData as BaseCreateData } from '../../../common/modules/base/dto/create.dto';
import { TeamStatuses } from 'src/enums';

export class CreateTeamData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumberString()
  @IsNotEmpty()
  leaderStaffCode: string;

  @IsArray()
  @IsNotEmpty()
  memberStaffCodes: string[];

  @IsOptional()
  @IsEnum(TeamStatuses)
  status: string;
}
