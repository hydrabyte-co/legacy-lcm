import { Entity, Column, Index } from 'typeorm';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDate,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Resources } from 'src/common/enums/resources';

@Entity(Resources.LCM_Partners)
export class Partner extends Base {
  @Column({ unique: true })
  code = '';

  @Column()
  name = '';

  @Column()
  userId = '';

  @Column()
  businessCode = '';

  @Column()
  contractCode = '';

  @Column()
  address = '';

  @Column()
  note = '';

  @Column()
  isActive = false;

  @Column()
  @IsDate()
  startedAt: Date = new Date();

  @Column()
  @IsDate()
  endedAt: Date = new Date();
}
