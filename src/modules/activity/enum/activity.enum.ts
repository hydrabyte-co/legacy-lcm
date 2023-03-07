export enum ActivityStatus {
  Draft = 'draft',
  Active = 'active',
  Archived = 'archived',
}

export enum ActivityTypeCode {
  SMS = 'sms',
  Call = 'call',
  Email = 'email',
  Chat = 'chat',
  Letter = 'letter',
  Visit = 'visit',
  Skip = 'skip',
}

export enum InvestigationTypeCode {
  Address = 'address',
  Email = 'email',
  SocialNetwork = 'social-network',
  PhoneNumber = 'phone-number',
  Other = 'other',
}

export enum RelationCode {
  Parent = 'parent',
  Spouse = 'spouse',
  Sibling = 'sibling',
  Friend = 'friend',
  Child = 'child',
  OtherRelative = 'other-relative',
  Colleague = 'colleague',
  Other = 'other',
  Client = 'client',
}
