// Example of creating AutoDialer automation with new design

const createAutomationExample = {
  type: "auto-dialer",
  frequency: 300, // 5 minutes (30-1800 seconds range)
  workingHours: [8, 9, 10, 11, 13, 14, 15, 16, 17], // 8AM-6PM excluding lunch 12-1PM
  workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  config: {
    partner: {
      id: "partner_123",
      name: "Hoàn Kim Law Firm",
      code: "HKLF_001"
    },
    staffs: [
      {
        id: "staff_456",
        name: "Nguyễn Văn A",
        email: "nguyenvana@hoankimlaw.com",
        staffCode: "NVA001"
      },
      {
        id: "staff_789",
        name: "Trần Thị B", 
        email: "tranthib@hoankimlaw.com",
        staffCode: "TTB002"
      }
    ],
    phoneNumbers: ["+84901234567", "+84901234568"], // Array of phone numbers
    retryAttempts: 3,
    concurrentCallRatio: 1.5 // 1.5x multiplier for concurrent calls
  },
  status: "active",
  notes: "Auto dialer for debt collection calls during business hours"
};

// Response example - now returns full automation data
const responseExample = {
  id: "64f7b1234567890abcdef123",
  type: "auto-dialer",
  frequency: 300,
  workingHours: [8, 9, 10, 11, 13, 14, 15, 16, 17],
  workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  config: {
    partner: {
      id: "partner_123",
      name: "Hoàn Kim Law Firm",
      code: "HKLF_001"
    },
    staffs: [
      {
        id: "staff_456",
        name: "Nguyễn Văn A",
        email: "nguyenvana@hoankimlaw.com",
        staffCode: "NVA001"
      },
      {
        id: "staff_789",
        name: "Trần Thị B",
        email: "tranthib@hoankimlaw.com", 
        staffCode: "TTB002"
      }
    ],
    phoneNumbers: ["+84901234567", "+84901234568"],
    retryAttempts: 3,
    concurrentCallRatio: 1.5
  },
  status: "active",
  notes: "Auto dialer for debt collection calls during business hours",
  createdAt: "2025-08-29T10:30:00.000Z",
  updatedAt: "2025-08-29T10:30:00.000Z"
};
