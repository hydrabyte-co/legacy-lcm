import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsObject,
    IsString
} from 'class-validator';
import { Column, Entity } from 'typeorm';
import { Resources } from '../../../common/enums/resources';
import { Base } from '../../../common/modules/base/entity/base.entity';
import {
    ExportData_FromDocuments,
    ExportData_OutputFileType,
    ExportData_Status,
} from '../enum/export-data.enum';

export type ExportData_Datasource = {
  name: ExportData_FromDocuments;
  where: {
    from: string;
    to: string;
    [key: string]: string | number;
  };
};

export type ExportData_Result = {
  name: ExportData_FromDocuments;
  count: number;
};

@Entity(Resources.LCM_ExportData)
export class ExportData extends Base {
  @Column()
  @IsString()
  fileId = '';

  @Column()
  @IsArray()
  datasources: ExportData_Datasource[];

  @Column()
  @IsArray()
  results: ExportData_Result[];

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
