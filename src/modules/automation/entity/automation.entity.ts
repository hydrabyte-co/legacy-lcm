import { Entity, Column } from 'typeorm';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsObject,
  IsOptional,
  IsDate,
  IsArray,
  Matches,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Resources } from 'src/common/enums/resources';
import { AutomationType, AutomationStatus, WeekDay } from '../enum/automation.enum';
import { AutomationConfig } from './automation-config.interface';

@Entity(Resources.LCM_Automations)
export class Automation extends Base {
  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string = '';

  @Column()
  @IsEnum(AutomationType)
  @IsNotEmpty()
  type: AutomationType = AutomationType.AutoDialer;

  @Column()
  @IsNumber()
  @Min(60) // Minimum 1 minute
  @Max(86400) // Maximum 24 hours
  frequency: number = 300; // 5 minutes default

  @Column({ type: 'json' })
  @IsObject()
  config: AutomationConfig;

  @Column()
  @IsEnum(AutomationStatus)
  status: AutomationStatus = AutomationStatus.Inactive;

  @Column()
  @IsNumber()
  @Min(1)
  @Max(10)
  priority: number = 5;

  @Column()
  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;

  // Execution tracking
  @Column()
  @IsDate()
  @IsOptional()
  lastExecutedAt?: Date;

  @Column()
  @IsDate()
  @IsOptional()
  nextExecutionAt?: Date;

  @Column()
  @IsNumber()
  @Min(0)
  executionCount: number = 0;

  @Column()
  @IsNumber()
  @Min(0)
  successCount: number = 0;

  @Column()
  @IsNumber()
  @Min(0)
  errorCount: number = 0;

  // Business constraints
  @Column()
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/) // HH:MM format
  startTime?: string;

  @Column()
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  endTime?: string;

  @Column({ type: 'json' })
  @IsArray()
  @IsOptional()
  @IsEnum(WeekDay, { each: true })
  workingDays?: WeekDay[];

  @Column()
  @IsNumber()
  @Min(1)
  @Max(50)
  @IsOptional()
  maxConcurrentJobs?: number;
}