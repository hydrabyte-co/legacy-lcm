/**
 * Types of automation supported by LCM service
 */
export enum AutomationType {
  AutoDialer = 'auto-dialer',
  AutoSMS = 'auto-sms',
  AutoEmail = 'auto-email',
  AutoReminder = 'auto-reminder',
}

/**
 * Status of automation execution
 */
export enum AutomationStatus {
  Active = 'active',
  Inactive = 'inactive',
  Paused = 'paused',
  Error = 'error',
  Maintenance = 'maintenance',
}

/**
 * Days of the week for scheduling
 */
export enum WeekDay {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'sunday',
}

/**
 * Priority levels for automation execution
 */
export enum AutomationPriority {
  Low = 1,
  Medium = 5,
  High = 10,
}

/**
 * Execution outcomes for automation
 */
export enum AutomationExecutionStatus {
  Pending = 'pending',
  Running = 'running',
  Completed = 'completed',
  Failed = 'failed',
  Cancelled = 'cancelled',
}