import {
    IsDate,
    IsNotEmpty,
    IsString,
    MaxLength
} from 'class-validator';
import { Column, Entity } from 'typeorm';
import { Resources } from '../../../common/enums/resources';
import { Base } from '../../../common/modules/base/entity/base.entity';

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
