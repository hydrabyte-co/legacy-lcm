# Call Module

**Business Purpose:** Quản lý hệ thống cuộc gọi đòi nợ bao gồm click-to-call, auto call và auto dialer

---

## 📋 Overview

Call module là trung tâm của debt collection operations, quản lý tất cả các cuộc gọi từ staff đến customers. Module tích hợp với các hệ thống telecom để thực hiện cuộc gọi và ghi lại kết quả thu hồi nợ.

### Business Context
- **Primary Function:** Thực hiện cuộc gọi đòi nợ đến customers
- **Call Types:** Click-to-call (manual), Auto Call (ATC), Auto Dialer
- **Integration:** Telecom systems, recording systems, CRM
- **Performance:** Call success rates, connection quality, conversion rates

---

## 🏗 Technical Architecture

### Module Structure
```
src/modules/call/
├── call.controller.ts        # REST API endpoints + webhook receivers
├── call.service.ts          # Business logic & telecom integration
├── call.module.ts           # NestJS module với external integrations
├── dto/
│   ├── create.dto.ts        # Call initiation request
│   ├── update-one.dto.ts    # Call result updates
│   └── find-one.dto.ts      # Call details với recording links
├── entity/
│   └── call.entity.ts       # MongoDB schema với telecom fields
└── enum/
    └── call.enum.ts         # CallType, CallStatus, CallResult enums
```

### Database Connection
- **Primary:** MongoDB ('voice' connection for call-specific database)
- **Collection:** `calls`
- **Performance Indexes:** `customerCode`, `staffCode`, `callStatus`, `startTime`

### External Integrations
- **Telecom System:** Originate calls, receive webhooks
- **Recording System:** Call recording storage và retrieval
- **Auto Dialer:** Queue management và call distribution

---

## 🛠 API Endpoints

### Core Call Operations
```typescript
GET    /calls                        # List calls với filtering options
GET    /calls/:id                    # Get call details with recording
POST   /calls                        # Initiate new call
PUT    /calls/:id                    # Update call result/status
DELETE /calls/:id                    # Archive call record
```

### Call System Integration
```typescript
POST   /calls/originate              # Originate click-to-call
POST   /calls/originate-auto         # Queue auto call (ATC)
POST   /calls/originate-dialer       # Add to auto dialer queue
POST   /calls/webhook/status         # Receive telecom status updates
POST   /calls/webhook/recording      # Receive recording completion
GET    /calls/:id/recording          # Download call recording
```

### Business Operations
```typescript
GET    /calls/by-customer/:code      # Customer's call history
GET    /calls/by-staff/:code         # Staff's call history
GET    /calls/active                 # Currently active calls
GET    /calls/queue-status           # Auto dialer queue status
POST   /calls/bulk-originate         # Bulk call origination
GET    /calls/performance            # Call center performance metrics
```

### Analytics Endpoints
```typescript
GET    /calls/analytics/success-rate    # Call success rate by period
GET    /calls/analytics/duration        # Average call duration
GET    /calls/analytics/results         # Call result distribution
GET    /calls/analytics/staff           # Staff performance metrics
```

---

## 📊 Business Logic

### Call Types
```typescript
enum CallType {
  ClickToCall = 'click-to-call',    // Manual dialing by staff
  AutoCall = 'auto-call',           // Automated outbound calling (ATC)
  AutoDialer = 'auto-dialer'        // Progressive/predictive dialer
}
```

### Call Flow Workflow
```typescript
// 1. Call Initiation
const callFlow = {
  initiation: {
    'click-to-call': 'Staff manually initiates call',
    'auto-call': 'System automatically dials customer',
    'auto-dialer': 'Dialer system distributes call to available staff'
  },
  
  // 2. Connection Process
  connection: {
    dialing: 'System dials customer number',
    ringing: 'Phone ringing, waiting for answer',
    connected: 'Customer answered, staff connected',
    failed: 'No answer, busy, or technical failure'
  },
  
  // 3. Conversation & Result
  conversation: {
    recording: 'Call recorded for quality và compliance',
    notes: 'Staff enters conversation notes',
    result: 'Staff selects call outcome',
    followUp: 'Schedule follow-up actions if needed'
  },
  
  // 4. Post-Call Processing
  completion: {
    duration: 'Calculate total call duration',
    cost: 'Calculate call cost for reporting',
    activity: 'Create activity record',
    scheduling: 'Schedule follow-up calls if needed'
  }
};
```

### Call Results & Actions
```typescript
enum CallResult {
  // Positive outcomes
  PromiseToPay = 'promise-to-pay',        // Customer committed to pay
  PartialPayment = 'partial-payment',     // Customer made partial payment
  PaymentArrangement = 'payment-arrangement', // Agreed payment plan
  
  // Neutral outcomes  
  ContactMade = 'contact-made',           // Spoke with customer, no commitment
  InfoUpdate = 'info-update',             // Updated customer information
  CallBack = 'call-back',                 // Customer requested callback
  
  // Negative outcomes
  Refused = 'refused',                    // Customer refused to pay
  Dispute = 'dispute',                    // Customer disputes debt
  Hostile = 'hostile',                    // Aggressive/threatening behavior
  
  // Technical outcomes
  NoAnswer = 'no-answer',                 // Phone not answered
  Busy = 'busy',                          // Phone busy
  InvalidNumber = 'invalid-number',       // Wrong/disconnected number
  TechnicalError = 'technical-error'      // System/network issues
}
```

---

## 🔄 Integration Points

### Core Relationships
```typescript
// Required relationships
Customer ←→ Call     // 1:N - Customer receives nhiều calls
Staff    ←→ Call     // 1:N - Staff makes nhiều calls  
Partner  ←→ Call     // 1:N - Partner's customers receive calls

// Generated relationships
Call → Activity      // 1:1 - Each call generates activity record
Call → Transaction   // 0:1 - Successful calls may generate payments
```

### Telecom System Integration
```typescript
interface TelecomIntegration {
  // Outbound call origination
  originateCall: {
    fromNumber: string,      // Staff/system phone number
    toNumber: string,        // Customer phone number
    dialplanId: string,      // Routing configuration
    callbackUrl: string      // Webhook for status updates
  },
  
  // Call status webhooks
  statusWebhook: {
    callId: string,
    status: CallStatus,
    timestamp: Date,
    duration?: number,
    recordingUrl?: string
  },
  
  // Recording integration  
  recordingService: {
    downloadUrl: string,
    duration: number,
    fileSize: number,
    format: 'wav' | 'mp3',
    transcription?: string
  }
}
```

---

## 🧪 Testing

### Call System Testing
```typescript
import { MockDataGenerator, TestDatabaseHelper } from '../../test-utils';

// Test complete call scenario
const callScenario = MockDataGenerator.generateDebtCollectionScenario();
const testCall = MockDataGenerator.generateCall({
  customerCode: callScenario.customer.code,
  staffCode: callScenario.staff.code,
  partnerCode: callScenario.partner.code,
  callType: CallType.ClickToCall,
  callResult: CallResult.PromiseToPay,
  promiseToPayAmount: 1000000,
  promiseToPayDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
});

// Validate call business rules
VALIDATION_HELPERS.validateCallData(testCall, 
  callScenario.customer, 
  callScenario.staff
);
```

### Performance Testing
```typescript
// Test bulk call origination
const bulkCalls = MockDataGenerator.generateBulkData('call', 100, {
  callType: CallType.AutoCall,
  callStatus: CallStatus.Queued
});

// Test auto dialer performance
await callService.originateBulkCalls(bulkCalls);
expect(queueProcessingTime).toBeLessThan(30000); // < 30 seconds
```

### Integration Testing
```typescript
// Mock telecom webhook responses
const mockWebhookData = {
  callId: 'test-call-123',
  status: CallStatus.Connected,
  duration: 180,
  recordingUrl: 'https://recordings.example.com/test.wav'
};

await callController.handleStatusWebhook(mockWebhookData);
```

---

## 📈 Performance Considerations

### Database Optimization
```typescript
// Call-specific performance indexes
db.calls.createIndex({ 
  "customerCode": 1, 
  "startTime": -1 
})  // Customer call history

db.calls.createIndex({ 
  "staffCode": 1, 
  "callStatus": 1,
  "startTime": -1 
})  // Staff active calls

db.calls.createIndex({ 
  "partnerCode": 1, 
  "callResult": 1,
  "startTime": -1 
})  // Partner call performance

db.calls.createIndex({ 
  "callStatus": 1,
  "startTime": -1 
})  // Queue management
```

### Call System Performance
- **Connection Speed:** < 3 seconds to establish connection
- **Queue Processing:** Process 1000+ calls per minute
- **Recording Storage:** Async recording processing
- **Webhook Handling:** < 500ms response time for status updates

### Auto Dialer Optimization
- **Predictive Dialing:** Optimize abandon rate < 3%
- **Progressive Dialing:** 1:1 staff to call ratio
- **Queue Management:** Real-time queue status updates
- **Load Balancing:** Distribute calls across available staff

---

## 🔒 Security & Compliance

### Call Recording Compliance
```typescript
// Recording compliance requirements
const recordingCompliance = {
  consent: 'Customer consent required before recording',
  retention: '7 years retention for regulatory compliance',
  access: 'Role-based access to recordings',
  encryption: 'Recordings encrypted at rest và in transit',
  audit: 'All recording access logged'
};

// Privacy protection
const privacyControls = {
  numberMasking: 'Mask phone numbers in logs',
  callContentSecurity: 'Secure recording storage',
  dataRetention: 'Automated deletion after retention period',
  accessControls: 'Staff can only access assigned customer calls'
};
```

### Debt Collection Regulations
- **Call Time Restrictions:** No calls outside 8AM-9PM local time
- **Frequency Limits:** Max 3 attempts per day per customer
- **Do Not Call Lists:** Honor customer DNC requests
- **Harassment Prevention:** Monitor call frequency và content

---

## 🐛 Common Issues & Troubleshooting

### Call Connection Issues
```javascript
// Debug failed call connections
db.calls.find({
  "callStatus": "failed",
  "startTime": { $gte: new Date(Date.now() - 24*60*60*1000) }
})

// Check call success rates by staff
db.calls.aggregate([
  { $match: { "startTime": { $gte: new Date(Date.now() - 7*24*60*60*1000) } } },
  { $group: {
    _id: "$staffCode",
    totalCalls: { $sum: 1 },
    successfulCalls: { $sum: { $cond: [{ $eq: ["$callStatus", "completed"] }, 1, 0] } }
  }},
  { $addFields: { successRate: { $divide: ["$successfulCalls", "$totalCalls"] } } }
])
```

### Performance Issues
- **High Abandon Rates:** Adjust dialer algorithms
- **Poor Call Quality:** Check telecom provider issues
- **Slow Queue Processing:** Scale dialer infrastructure
- **Recording Delays:** Optimize recording pipeline

### Integration Issues
- **Webhook Failures:** Implement retry mechanisms
- **Recording Sync:** Monitor recording completion
- **Telecom API Errors:** Implement fallback systems
- **Status Mismatches:** Reconcile call status regularly

---

## 📝 Development Notes

### Call System Architecture
```typescript
// Call origination flow
const originateCall = async (callData: CreateCallData) => {
  // 1. Validate customer và staff
  await validateCallParticipants(callData);
  
  // 2. Create call record
  const call = await callRepository.save(callData);
  
  // 3. Originate via telecom system
  const telecomResult = await telecomService.originate({
    fromNumber: staff.phoneNumber,
    toNumber: customer.mobileNumber,
    callId: call.id,
    webhookUrl: `/calls/webhook/status`
  });
  
  // 4. Update call với telecom reference
  call.externalCallId = telecomResult.callId;
  await callRepository.save(call);
  
  return call;
};
```

### Recent Updates
- ✅ **2025-01-17:** Added missing find-one.dto.ts
- ✅ **2025-01-17:** Enhanced call result validation
- ✅ **2025-01-17:** Improved telecom integration patterns
- ✅ **2025-01-17:** Added comprehensive test scenarios

### Future Enhancements
- [ ] **AI Call Analysis:** Sentiment analysis of call recordings
- [ ] **Predictive Dialing:** ML-optimized dialing algorithms
- [ ] **Voice Recognition:** Automated call transcription
- [ ] **Real-time Coaching:** Live assistance for staff during calls

### Agent Development Tips
- Always validate phone numbers before call origination
- Implement proper error handling for telecom failures
- Monitor call performance metrics continuously
- Follow debt collection compliance regulations
- Use MockDataGenerator for realistic call testing scenarios

---

*Call Module Documentation - LCM Service*  
*Core component of debt collection call center operations*  
*Last Updated: 2025-01-17*