import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Resources } from 'src/common/enums/resources';
import { Column, Entity } from 'typeorm';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { AutomationStatus, AutomationType, WeekDay } from '../enum/automation.enum';
import { AutomationConfig } from './automation-config.interface';

@Entity(Resources.LCM_Automations)
export class Automation extends Base {
  @Column()
  @IsEnum(AutomationType)
  @IsNotEmpty()
  type: AutomationType = AutomationType.AutoDialer;

  @Column()
  @IsNumber()
  @Min(30) // Minimum 30 seconds
  @Max(1800) // Maximum 30 minutes
  frequency: number = 300; // 5 minutes default

  @Column({ type: 'json', nullable: true })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(24)
  workingHours?: number[]; // 0-23 representing hours of the day

  @Column({ type: 'json', nullable: true })
  @IsArray()
  @IsOptional()
  @IsEnum(WeekDay, { each: true })
  workingDays?: WeekDay[];

  @Column({ type: 'json' })
  @IsObject()
  config: AutomationConfig;

  @Column()
  @IsEnum(AutomationStatus)
  status: AutomationStatus = AutomationStatus.Inactive;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}