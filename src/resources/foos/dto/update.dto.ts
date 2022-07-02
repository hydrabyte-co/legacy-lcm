import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateFooDTO } from './create.dto';

export class UpdateFooDTO extends PartialType(
  OmitType(CreateFooDTO, ['name']),
) {}
