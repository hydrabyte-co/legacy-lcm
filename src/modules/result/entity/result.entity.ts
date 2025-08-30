import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength
} from 'class-validator';
import { Column, Entity } from 'typeorm';
import { Resources } from '../../../common/enums/resources';
import { Base } from '../../../common/modules/base/entity/base.entity';


@Entity(Resources.LCM_Results)
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
