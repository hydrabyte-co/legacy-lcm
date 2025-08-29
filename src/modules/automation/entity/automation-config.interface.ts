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
  contractType?: string;
}

/**
 * Staff information for automation
 */
export interface StaffInfo {
  id: string;
  name: string;
  email: string;
  staffCode: string;
  skills?: string[];
  maxConcurrentCalls?: number;
  workingHours?: {
    start: string;
    end: string;
  };
}

/**
 * Phone number information for dialer
 */
export interface PhoneNumberInfo {
  id: string;
  number: string;
  description: string;
  provider: string;
  isActive: boolean;
}

/**
 * Customer filter criteria
 */
export interface CustomerFilter {
  field: string; // "contractAmount" | "overdueDays" | "lastCallDate"
  operator: "gt" | "lt" | "eq" | "between" | "in";
  value: any;
}

/**
 * Auto Dialer specific configuration
 */
export interface AutoDialerConfig extends AutomationConfig {
  type: AutomationType.AutoDialer;
  
  // Partner selection
  partners: PartnerInfo[];
  
  // Staff assignment
  staffAssignment: {
    mode: "round-robin" | "skill-based" | "availability-based";
    staffs: StaffInfo[];
    maxCallsPerStaff: number;
  };

  // Phone system configuration  
  phoneSystem: {
    provider: "viettel" | "fpt" | "vnpt";
    phoneNumbers: PhoneNumberInfo[];
    callTimeout: number; // seconds
  };

  // Call logic
  callRules: {
    retryAttempts: number;
    retryInterval: number; // minutes
    concurrentCallRatio: number; // 0.5 - 2.0
    customerFilters?: CustomerFilter[];
  };

  // Call outcomes
  callHandling: {
    onAnswer: "connect-to-staff" | "play-message" | "record-message";
    onNoAnswer: "retry" | "sms-followup" | "mark-attempted";
    onBusy: "retry-later" | "try-alternate-number";
    onError: "retry" | "escalate" | "pause-automation";
  };
}

/**
 * Future automation types can be added here
 * Example: AutoSMSConfig, AutoEmailConfig, etc.
 */
export type AutomationConfigTypes = AutoDialerConfig;