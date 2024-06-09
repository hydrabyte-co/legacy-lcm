import { Entity, Column, Index } from 'typeorm';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Resources } from 'src/common/enums/resources';

@Entity(Resources.LCM_Investigations)
export class Investigation extends Base {
  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  customerCode = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  staffCode = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  typeCode = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  value = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  note = '';

  @Column()
  @IsDate()
  date: Date = new Date();

  @Column()
  @IsString()
  fromFile = '';
}
