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
  ExportData_FromDocuments,
  ExportData_OutputFileType,
  ExportData_Status,
} from '../enum/export-data.enum';

export type ExportData_Datasources = {
  [key in ExportData_FromDocuments]: {
    where: {
      from: string;
      to: string;
    };
  };
};

@Entity(Controllers.LCM_ExportData)
export class ExportData extends Base {
  @Column()
  @IsString()
  fileId = '';

  @Column()
  @IsObject()
  datasources: ExportData_Datasources;

  @Column()
  @IsString()
  outputFileType: ExportData_OutputFileType = ExportData_OutputFileType.Excel;

  @Column()
  @IsObject()
  error: any = {};

  @Column()
  @IsString()
  @IsNotEmpty()
  note = '';

  @Column()
  @IsEnum(ExportData_Status)
  status = ExportData_Status.Todo;
}
