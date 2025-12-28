import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString
} from 'class-validator';
import { AutomationStatus, AutomationType } from '../enum/automation.enum';

export class FindAutomationData {
  @IsEnum(AutomationType)
  @IsOptional()
  type?: AutomationType;

  @IsEnum(AutomationStatus)
  @IsOptional()
  status?: AutomationStatus;

  @IsString()
  @IsOptional()
  partnerId?: string; // Filter by partner ID in config

  @IsString()
  @IsOptional()
  staffId?: string; // Filter by assigned staff

  @IsBoolean()
  @IsOptional()
  activeOnly?: boolean; // Only active automations
}