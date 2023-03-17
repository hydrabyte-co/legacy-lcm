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
  ExportData_ExportRule,
  ExportData_Status,
  ExportData_ToTable,
} from '../enum/export-data.enum';

@Entity(Controllers.LCM_ExportData)
export class ExportData extends Base {
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
      toTable: ExportData_ToTable;
      rule: ExportData_ExportRule;
      [key: string]: any;
    }[];
  } = { sheets: [] };

  @Column()
  @IsString()
  @IsNotEmpty()
  note = '';

  @Column()
  @IsEnum(ExportData_Status)
  status = ExportData_Status.New;
}
