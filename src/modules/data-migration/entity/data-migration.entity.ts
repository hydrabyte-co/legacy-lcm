import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsString
} from 'class-validator';
import { Column, Entity } from 'typeorm';
import { Resources } from '../../../common/enums/resources';
import { Base } from '../../../common/modules/base/entity/base.entity';
import {
    DataMigration_Collections,
    DataMigration_Status,
} from '../enum/data-migration.enum';

export type DataMigration_Datasource = {
  name: DataMigration_Collections;
  where: {
    from: string;
    to: string;
  };
};

export type DataMigration_Result = {
  totalCount: number;
  processedCount: number;
  successCount: number;
  failedCount: number;
};

@Entity(Resources.LCM_DataMigration)
export class DataMigration extends Base {
  @Column()
  collectionName = '';

  @Column()
  filter = {};

  @Column()
  @IsArray()
  results: DataMigration_Result = {
    totalCount: 0,
    processedCount: 0,
    successCount: 0,
    failedCount: 0,
  };

  @Column()
  error: any = {};

  @Column()
  @IsString()
  @IsNotEmpty()
  note = '';

  @Column()
  @IsEnum(DataMigration_Status)
  status = DataMigration_Status.Todo;
}
