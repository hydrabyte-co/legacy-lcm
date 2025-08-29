import { AutomationType } from '../enum/automation.enum';

/**
 * Base interface for all automation configurations
 */
export interface AutomationConfig {
  type: AutomationType;
}

/**
 * Partner information for automation
 */
export interface PartnerInfo {
  id: string;
  name: string;
  code: string;
}

/**
 * Staff information for automation
 */
export interface StaffInfo {
  id: string;
  name: string;
  email: string;
  staffCode: string;
}

/**
 * Phone number information for dialer
 */
export interface PhoneNumberInfo {
  id: string;
  number: string;
  description: string;
}

/**
 * Auto Dialer specific configuration
 */
export interface AutoDialerConfig extends AutomationConfig {
  partner: PartnerInfo;
  
  staffs: StaffInfo[];

  phoneNumbers: string[];

  retryAttempts: number;

  concurrentCallRatio: number; // 0.5 - 2.0, multiplier for concurrent calls
}

/**
 * Future automation types can be added here
 * Example: AutoSMSConfig, AutoEmailConfig, etc.
 */
export type AutomationConfigTypes = AutoDialerConfig;