import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
    MaxLength
} from 'class-validator';
import { Column, Entity } from 'typeorm';
import { Resources } from '../../../common/enums/resources';
import { Base } from '../../../common/modules/base/entity/base.entity';

export type PerformanceTaget = {
  code: string;
  type: 'number' | 'percentage';
  value: number;
};

export type PerformanceResult = {
  code: string;
  type: 'number' | 'percentage';
  value: number;
};

@Entity(Resources.LCM_Performance)
export class Performance extends Base {
  @Column()
  @IsNumber()
  @IsNotEmpty()
  year = 0;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  month = 0;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  staffCode = '';

  @Column()
  @IsArray()
  targets: PerformanceTaget[] = [];

  @Column()
  @IsArray()
  results: PerformanceResult[] = [];
}
