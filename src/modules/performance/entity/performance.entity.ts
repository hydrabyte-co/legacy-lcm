import { Entity, Column, Index } from 'typeorm';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDate,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Resources } from 'src/common/enums/resources';

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
