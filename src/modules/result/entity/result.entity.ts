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
import { Controllers } from 'src/common/enums/controllers';

@Entity(Controllers.LCM_Results)
export class Result extends Base {
  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  code = '';

  @Column()
  @IsString()
  @MaxLength(24)
  parentCode = '';

  @Column()
  @IsNumber()
  index = 0;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  note = '';

  @Column()
  @IsBoolean()
  @IsNotEmpty()
  isActive = false;

  @Column()
  @IsBoolean()
  @IsNotEmpty()
  isSelectable = true;
}
