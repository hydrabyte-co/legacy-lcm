import { Entity, Column, Index } from 'typeorm';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDate,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';

@Entity(Controllers.LCM_Partners)
export class Partner extends Base {
  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  code = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  businessCode = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  contractCode = '';

  @Column()
  @IsString()
  @MaxLength(46)
  address = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  note = '';

  @Column()
  @IsBoolean()
  @IsNotEmpty()
  isActive = false;

  @Column()
  @IsDate()
  startedAt: Date = new Date();

  @Column()
  @IsDate()
  endedAt: Date = new Date();
}
