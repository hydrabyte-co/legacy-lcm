import { Entity, Column } from 'typeorm';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsObject,
  IsEnum,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Resources } from 'src/common/enums/resources';
import {
  ImportData_ImportRule,
  ImportData_Status,
  ImportData_ToTable,
} from '../enum/import-data.enum';

@Entity(Resources.LCM_ImportData)
export class ImportData extends Base {
  @Column()
  @IsString()
  @IsNotEmpty()
  fileName = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  fileId = '';

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
    closeAll: boolean;
    sheets: {
      name: string;
      toTable: ImportData_ToTable;
      rule: ImportData_ImportRule;
      [key: string]: any;
    }[];
  } = { sheets: [], closeAll: false };

  @Column()
  @IsString()
  @IsNotEmpty()
  note = '';

  @Column()
  @IsEnum(ImportData_Status)
  status = ImportData_Status.New;
}
