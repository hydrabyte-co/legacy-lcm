import { Entity, Column, Index } from 'typeorm';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDate,
  IsDateString,
  IsNumber,
  IsObject,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';
import { CustomerStatus } from '../enum/customer.enum';

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
  @MaxLength(360)
  temporaryAddress = '';

  @Column()
  @IsString()
  @MaxLength(360)
  permanentAddress = '';

  @Column()
  @IsString()
  @MaxLength(360)
  officeAddress = '';

  @Column()
  @IsString()
  @MaxLength(360)
  officeName = '';

  @Column()
  @IsString()
  @MaxLength(60)
  jobPosition = '';

  @Column()
  @IsString()
  @MaxLength(60)
  businessDomain = '';

  @Column()
  @IsEnum(CustomerStatus)
  status = CustomerStatus.Active;

  @Column()
  @IsString()
  @MaxLength(360)
  note = '';

  @Column()
  @IsNumber()
  priority;

  @Column()
  @IsObject()
  lastActivity: {
    [key: string]: any;
  };

  //activitiesCountInMonth
  @Column()
  @IsNumber()
  acim = 0;

  //totalPaymentAmountInMonth
  @Column()
  @IsNumber()
  tpaim = 0;

  //totalPaymentAmountFromPartnerInMonth
  @Column()
  @IsNumber()
  tpafpim = 0;

  //resultCodesInMonth
  @Column()
  @IsArray()
  rcim: string[] = [];

  //totalBalanceInMonth
  @Column()
  @IsNumber()
  tbim = 0;

  //largestOVDDays
  @Column()
  @IsNumber()
  lovdd = 0;

  @Column()
  @IsObject()
  lastPTPActivity: {
    [key: string]: any;
  };
}
