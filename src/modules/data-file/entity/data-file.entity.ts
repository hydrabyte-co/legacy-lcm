import { Entity, Column } from 'typeorm';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsObject,
  IsEnum,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';
import { DataFileStatus } from '../enum/data-file.enum';

@Entity(Controllers.LCM_DataFiles)
export class DataFile extends Base {
  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  fileName = '';

  @Column()
  @IsObject()
  info = {};

  @Column()
  @IsObject()
  settings = {};

  @Column()
  @IsString()
  @IsNotEmpty()
  note = '';

  @Column()
  @IsEnum(DataFileStatus)
  status = DataFileStatus.New;
}
