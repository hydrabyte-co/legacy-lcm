import { IsString, IsDate } from 'class-validator';
import {
  UpdateResult as BaseUpdateResult,
  UpdateData as BaseUpdateData,
} from 'src/resources/base/dto/update-by-id.dto';

export class UpdateData extends BaseUpdateData {}
export class UpdateResult extends BaseUpdateResult {}
