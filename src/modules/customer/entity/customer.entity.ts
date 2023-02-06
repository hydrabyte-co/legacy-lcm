import { Entity, Column, Index } from 'typeorm';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDate,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';

@Entity(Controllers.LCM_Customers)
export class Customer extends Base {
  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  code = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  partnerCode = '';

  @Column()
  @IsString()
  @MaxLength(12)
  callStaffCode = '';

  @Column()
  @IsString()
  @MaxLength(12)
  fieldStaffCode = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  fullname = '';

  @Column()
  @IsString()
  @MaxLength(12)
  gender = '';

  @Column()
  @IsString()
  dob = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  identityNumber = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  mobileNumber = '';

  @Column()
  @IsString()
  @MaxLength(12)
  officeNumber = '';

  @Column()
  @IsString()
  @MaxLength(36)
  email = '';

  @Column()
  @IsString()
  @MaxLength(180)
  temporaryAddress = '';

  @Column()
  @IsString()
  @MaxLength(180)
  permanentAddress = '';

  @Column()
  @IsString()
  @MaxLength(12)
  status = '';

  @Column()
  @IsString()
  @MaxLength(360)
  note = '';

  @Column()
  @IsNumber()
  priority;

  @Column()
  @IsDate()
  lastActivityDate = new Date();
}
