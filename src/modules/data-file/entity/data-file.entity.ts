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
import {
  DataFile_ImportRule,
  DataFile_Status,
  DataFile_ToTable,
} from '../enum/data-file.enum';

@Entity(Controllers.LCM_DataFiles)
export class DataFile extends Base {
  @Column()
  @IsString()
  @IsNotEmpty()
  fileName = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  partnerCode = '';

  @Column()
  @IsObject()
  info: {
    sheets?: { [key: string]: any }[];
  } = {
    sheets: [],
  };

  @Column()
  @IsObject()
  settings: {
    sheets: {
      name: string;
      toTable: DataFile_ToTable;
      rule: DataFile_ImportRule;
      [key: string]: any;
    }[];
  } = { sheets: [] };

  @Column()
  @IsString()
  @IsNotEmpty()
  note = '';

  @Column()
  @IsEnum(DataFile_Status)
  status = DataFile_Status.New;
}
