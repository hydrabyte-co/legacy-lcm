import { Test, TestingModule } from '@nestjs/testing';
import { CallService } from './call.service';
import { MockDataGenerator, TestDatabaseHelper, COMMON_ASSERTIONS, VALIDATION_HELPERS } from '../../test-utils';
import { CallCreateDto } from './dto/create.dto';
import { CallUpdateOneDto } from './dto/update-one.dto';
import { CallFindOneDto } from './dto/find-one.dto';

describe('CallService - Critical Call Management Tests', () => {
  let service: CallService;
  let mockDataGenerator: MockDataGenerator;
  let testDbHelper: TestDatabaseHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CallService,
        {
          provide: 'CallModel',
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            find: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CallService>(CallService);
    mockDataGenerator = new MockDataGenerator();
    testDbHelper = new TestDatabaseHelper();
  });

  describe('Call System Operations', () => {
    describe('Click-to-Call Management', () => {
      it('should initiate click-to-call with proper validation', async () => {
        // Arrange
        const customer = mockDataGenerator.generateCustomerData();
        const staff = mockDataGenerator.generateStaffData();
        const createDto: CallCreateDto = {
          customerCode: customer.code,
          staffCode: staff.code,
          phoneNumber: customer.contactInfo.primaryPhone,
          callType: 'CLICK_TO_CALL',
          priority: 'HIGH',
          scheduledAt: new Date(),
          purpose: 'DEBT_COLLECTION',
          expectedDuration: 300, // 5 minutes
          createdBy: staff.code
        };

        // Act
        const call = await service.create(createDto);

        // Assert
        COMMON_ASSERTIONS.ENTITY_EXISTS(call);
        VALIDATION_HELPERS.validateCallData(call, customer, staff);
        expect(call.callType).toBe('CLICK_TO_CALL');
        expect(call.status).toBe('INITIATED');
        expect(call.phoneNumber).toBe(customer.contactInfo.primaryPhone);
        expect(call.purpose).toBe('DEBT_COLLECTION');
      });

      it('should validate business hours before call initiation', async () => {
        // Arrange
        const customer = mockDataGenerator.generateCustomerData();
        const staff = mockDataGenerator.generateStaffData();
        const afterHoursCall: CallCreateDto = {
          customerCode: customer.code,
          staffCode: staff.code,
          phoneNumber: customer.contactInfo.primaryPhone,
          callType: 'CLICK_TO_CALL',
          scheduledAt: new Date('2025-01-17T22:00:00Z'), // 10 PM
          purpose: 'DEBT_COLLECTION',
          createdBy: staff.code
        };

        // Act & Assert
        await expect(service.create(afterHoursCall))
          .rejects.toThrow('Cannot initiate calls outside business hours');
      });

      it('should enforce daily call limits per customer', async () => {
        // Arrange
        const customer = mockDataGenerator.generateCustomerData();
        const staff = mockDataGenerator.generateStaffData();
        
        // Create maximum allowed calls for today
        const existingCalls = mockDataGenerator.generateCallsForCustomer(customer.code, 3);
        
        const exceededLimitCall: CallCreateDto = {
          customerCode: customer.code,
          staffCode: staff.code,
          phoneNumber: customer.contactInfo.primaryPhone,
          callType: 'CLICK_TO_CALL',
          purpose: 'DEBT_COLLECTION',
          createdBy: staff.code
        };

        // Act & Assert
        await expect(service.create(exceededLimitCall))
          .rejects.toThrow('Daily call limit exceeded for customer');
      });
    });

    describe('Auto Dialer Operations', () => {
      it('should queue auto dialer call with proper configuration', async () => {
        // Arrange
        const customer = mockDataGenerator.generateCustomerData();
        const partner = mockDataGenerator.generatePartnerData();
        partner.debtCollectionSettings.allowAutoDialer = true;
        
        const autoDialerCall: CallCreateDto = {
          customerCode: customer.code,
          partnerCode: partner.code,
          phoneNumber: customer.contactInfo.primaryPhone,
          callType: 'AUTO_DIALER',
          priority: 'MEDIUM',
          purpose: 'DEBT_COLLECTION',
          autoDialerSettings: {
            maxRetries: 3,
            retryInterval: 3600, // 1 hour
            preferredTimeSlots: ['09:00-12:00', '14:00-17:00'],
            callbackNumber: partner.contactInfo.phone
          },
          createdBy: 'SYSTEM'
        };

        // Act
        const call = await service.create(autoDialerCall);

        // Assert
        expect(call.callType).toBe('AUTO_DIALER');
        expect(call.status).toBe('QUEUED');
        expect(call.autoDialerSettings).toBeDefined();
        expect(call.autoDialerSettings.maxRetries).toBe(3);
        expect(call.queuePosition).toBeGreaterThan(0);
      });

      it('should validate partner auto dialer permissions', async () => {
        // Arrange
        const customer = mockDataGenerator.generateCustomerData();
        const partner = mockDataGenerator.generatePartnerData();
        partner.debtCollectionSettings.allowAutoDialer = false; // Not allowed
        
        const autoDialerCall: CallCreateDto = {
          customerCode: customer.code,
          partnerCode: partner.code,
          phoneNumber: customer.contactInfo.primaryPhone,
          callType: 'AUTO_DIALER',
          purpose: 'DEBT_COLLECTION',
          createdBy: 'SYSTEM'
        };

        // Act & Assert
        await expect(service.create(autoDialerCall))
          .rejects.toThrow('Auto dialer not enabled for this partner');
      });

      it('should process auto dialer queue efficiently', async () => {
        // Arrange
        const queuedCalls = mockDataGenerator.generateAutoDialerQueue(100);
        const startTime = Date.now();

        // Act
        const result = await service.processAutoDialerQueue();
        const duration = Date.now() - startTime;

        // Assert
        expect(result.processedCalls).toBe(100);
        expect(result.successfulCalls).toBeGreaterThan(0);
        expect(result.failedCalls).toBeLessThan(20); // Less than 20% failure rate
        expect(duration).toBeLessThan(30000); // Process within 30 seconds
      });
    });

    describe('Auto Call (ATC) Management', () => {
      it('should execute automated call with proper scripting', async () => {
        // Arrange
        const customer = mockDataGenerator.generateCustomerData();
        const contract = mockDataGenerator.generateContractDataForCustomer(customer.code, 1)[0];
        
        const autoCall: CallCreateDto = {
          customerCode: customer.code,
          contractCode: contract.code,
          phoneNumber: customer.contactInfo.primaryPhone,
          callType: 'AUTO_CALL',
          priority: 'HIGH',
          purpose: 'PAYMENT_REMINDER',
          autoCallScript: {
            greeting: 'Chào bạn, đây là cuộc gọi từ hệ thống thu hồi nợ',
            debtInfo: `Bạn có khoản nợ ${contract.overdueAmount} VND cần thanh toán`,
            paymentOptions: 'Vui lòng thanh toán qua ngân hàng hoặc liên hệ hotline',
            maxDuration: 120 // 2 minutes
          },
          createdBy: 'SYSTEM'
        };

        // Act
        const call = await service.create(autoCall);

        // Assert
        expect(call.callType).toBe('AUTO_CALL');
        expect(call.status).toBe('INITIATED');
        expect(call.autoCallScript).toBeDefined();
        expect(call.autoCallScript.debtInfo).toContain(contract.overdueAmount.toString());
      });

      it('should handle call connection failures gracefully', async () => {
        // Arrange
        const call = mockDataGenerator.generateCallData('AUTO_CALL');
        
        // Simulate connection failure
        const connectionError = {
          errorCode: 'NO_ANSWER',
          errorMessage: 'Customer did not answer the call',
          timestamp: new Date(),
          retryable: true
        };

        // Act
        const updatedCall = await service.handleCallFailure(call.id, connectionError);

        // Assert
        expect(updatedCall.status).toBe('FAILED');
        expect(updatedCall.failureReason).toBe('NO_ANSWER');
        expect(updatedCall.retryScheduled).toBe(true);
        expect(updatedCall.nextRetryAt).toBeDefined();
        expect(updatedCall.attemptCount).toBe(call.attemptCount + 1);
      });

      it('should record call outcomes and customer responses', async () => {
        // Arrange
        const call = mockDataGenerator.generateCallData('AUTO_CALL', 'IN_PROGRESS');
        const outcome = {
          status: 'COMPLETED',
          duration: 95, // seconds
          customerResponse: 'PROMISED_TO_PAY',
          promisedDate: '2025-01-25',
          notes: 'Customer confirmed will pay by end of month',
          recordingFile: 'call_recording_123456.wav',
          quality: 'GOOD'
        };

        // Act
        const completedCall = await service.completeCall(call.id, outcome);

        // Assert
        expect(completedCall.status).toBe('COMPLETED');
        expect(completedCall.outcome).toBeDefined();
        expect(completedCall.outcome.customerResponse).toBe('PROMISED_TO_PAY');
        expect(completedCall.outcome.promisedDate).toBe('2025-01-25');
        expect(completedCall.duration).toBe(95);
        expect(completedCall.recordingFile).toBe('call_recording_123456.wav');
      });
    });

    describe('Call Analytics and Reporting', () => {
      it('should calculate staff call performance metrics', async () => {
        // Arrange
        const staffCode = 'STAFF_001';
        const period = { from: '2025-01-01', to: '2025-01-31' };
        const calls = mockDataGenerator.generateCallsForStaff(staffCode, 50);

        // Act
        const performance = await service.calculateStaffPerformance(staffCode, period);

        // Assert
        expect(performance.staffCode).toBe(staffCode);
        expect(performance.period).toEqual(period);
        expect(performance.totalCalls).toBe(50);
        expect(performance.successfulCalls).toBeGreaterThan(0);
        expect(performance.averageDuration).toBeGreaterThan(0);
        expect(performance.contactRate).toBeGreaterThan(0);
        expect(performance.contactRate).toBeLessThanOrEqual(1);
        expect(performance.promiseToPayRate).toBeDefined();
        expect(performance.averageCallsPerDay).toBeGreaterThan(0);
      });

      it('should generate call campaign effectiveness report', async () => {
        // Arrange
        const campaignId = 'CAMPAIGN_2025_01';
        const campaignCalls = mockDataGenerator.generateCallCampaign(campaignId, 200);

        // Act
        const report = await service.generateCampaignReport(campaignId);

        // Assert
        expect(report.campaignId).toBe(campaignId);
        expect(report.summary.totalCalls).toBe(200);
        expect(report.summary.contactRate).toBeDefined();
        expect(report.summary.promiseToPayRate).toBeDefined();
        expect(report.summary.actualPaymentRate).toBeDefined();
        expect(report.breakdown.byCallType).toBeDefined();
        expect(report.breakdown.byTimeOfDay).toBeDefined();
        expect(report.breakdown.byDayOfWeek).toBeDefined();
        expect(report.recommendations).toBeDefined();
      });

      it('should track call outcome patterns by customer segment', async () => {
        // Arrange
        const segments = ['HIGH_VALUE', 'MEDIUM_VALUE', 'LOW_VALUE'];
        
        // Act
        const patterns = await service.analyzeOutcomePatterns(segments);

        // Assert
        expect(patterns).toHaveLength(3);
        patterns.forEach(pattern => {
          expect(segments).toContain(pattern.segment);
          expect(pattern.totalCalls).toBeGreaterThan(0);
          expect(pattern.outcomes).toBeDefined();
          expect(pattern.outcomes.ANSWERED).toBeDefined();
          expect(pattern.outcomes.NO_ANSWER).toBeDefined();
          expect(pattern.outcomes.PROMISED_TO_PAY).toBeDefined();
          expect(pattern.bestTimeToCall).toBeDefined();
          expect(pattern.averageCallsToContact).toBeGreaterThan(0);
        });
      });
    });

    describe('Call Quality and Compliance', () => {
      it('should validate call compliance with regulations', async () => {
        // Arrange
        const call = mockDataGenerator.generateCallData('CLICK_TO_CALL', 'COMPLETED');
        
        // Act
        const compliance = await service.validateCallCompliance(call.id);

        // Assert
        expect(compliance.isCompliant).toBe(true);
        expect(compliance.checks).toBeDefined();
        expect(compliance.checks.businessHours).toBe(true);
        expect(compliance.checks.dailyLimit).toBe(true);
        expect(compliance.checks.doNotCallList).toBe(true);
        expect(compliance.checks.recordingConsent).toBe(true);
        expect(compliance.checks.scriptCompliance).toBe(true);
      });

      it('should detect and flag compliance violations', async () => {
        // Arrange
        const violatingCall = mockDataGenerator.generateCallData('AUTO_CALL');
        violatingCall.scheduledAt = new Date('2025-01-17T21:00:00Z'); // After hours
        violatingCall.recordingConsent = false; // No consent
        
        // Act
        const compliance = await service.validateCallCompliance(violatingCall.id);

        // Assert
        expect(compliance.isCompliant).toBe(false);
        expect(compliance.violations).toContain('AFTER_BUSINESS_HOURS');
        expect(compliance.violations).toContain('NO_RECORDING_CONSENT');
        expect(compliance.riskLevel).toBe('HIGH');
        expect(compliance.actionRequired).toBe(true);
      });

      it('should monitor call quality metrics', async () => {
        // Arrange
        const recordedCalls = mockDataGenerator.generateRecordedCalls(20);

        // Act
        const qualityReport = await service.analyzeCallQuality(recordedCalls.map(c => c.id));

        // Assert
        expect(qualityReport.averageQualityScore).toBeGreaterThan(0);
        expect(qualityReport.averageQualityScore).toBeLessThanOrEqual(10);
        expect(qualityReport.qualityDistribution).toBeDefined();
        expect(qualityReport.commonIssues).toBeDefined();
        expect(qualityReport.improvementAreas).toBeDefined();
        expect(qualityReport.complianceScore).toBeGreaterThan(0);
      });
    });
  });

  describe('Integration and Performance Tests', () => {
    it('should integrate with external telecom systems', async () => {
      // Arrange
      const call = mockDataGenerator.generateCallData('CLICK_TO_CALL');
      const telecomConfig = {
        provider: 'VIETTEL',
        endpoint: 'https://api.viettel.com/voice/call',
        credentials: { apiKey: 'test_key', secretKey: 'test_secret' }
      };

      // Act
      const integration = await service.initiateExternalCall(call.id, telecomConfig);

      // Assert
      expect(integration.success).toBe(true);
      expect(integration.externalCallId).toBeDefined();
      expect(integration.providerResponse).toBeDefined();
      expect(integration.estimatedDuration).toBeGreaterThan(0);
    });

    it('should handle high-volume call processing', async () => {
      // Arrange
      const bulkCalls = mockDataGenerator.generateBulkCallData(1000);
      const startTime = Date.now();

      // Act
      const result = await service.processBulkCalls(bulkCalls);
      const duration = Date.now() - startTime;

      // Assert
      expect(result.processedCalls).toBe(1000);
      expect(result.successRate).toBeGreaterThan(0.85); // 85% success rate
      expect(duration).toBeLessThan(120000); // Within 2 minutes
      expect(result.averageProcessingTime).toBeLessThan(100); // < 100ms per call
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle network connectivity issues gracefully', async () => {
      // Arrange
      const call = mockDataGenerator.generateCallData('AUTO_DIALER');
      
      // Simulate network error
      jest.spyOn(service, 'connectToTelecomProvider').mockRejectedValue(new Error('Network timeout'));

      // Act
      const result = await service.attemptCall(call.id);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/Network timeout/);
      expect(result.retryScheduled).toBe(true);
      expect(result.nextRetryAt).toBeDefined();
    });

    it('should handle invalid phone number formats', async () => {
      // Arrange
      const invalidCall: CallCreateDto = {
        customerCode: 'CUST_001',
        staffCode: 'STAFF_001',
        phoneNumber: 'invalid-phone-123',
        callType: 'CLICK_TO_CALL',
        purpose: 'DEBT_COLLECTION',
        createdBy: 'TEST_STAFF'
      };

      // Act & Assert
      await expect(service.create(invalidCall))
        .rejects.toThrow('Invalid phone number format');
    });

    it('should prevent concurrent call conflicts', async () => {
      // Arrange
      const customer = mockDataGenerator.generateCustomerData();
      const staff = mockDataGenerator.generateStaffData();
      
      // Start first call
      const firstCall = await service.create({
        customerCode: customer.code,
        staffCode: staff.code,
        phoneNumber: customer.contactInfo.primaryPhone,
        callType: 'CLICK_TO_CALL',
        purpose: 'DEBT_COLLECTION',
        createdBy: staff.code
      });

      // Try to start concurrent call to same customer
      const concurrentCall: CallCreateDto = {
        customerCode: customer.code,
        staffCode: 'STAFF_002',
        phoneNumber: customer.contactInfo.primaryPhone,
        callType: 'CLICK_TO_CALL',
        purpose: 'DEBT_COLLECTION',
        createdBy: 'STAFF_002'
      };

      // Act & Assert
      await expect(service.create(concurrentCall))
        .rejects.toThrow('Customer is currently in another call');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testDbHelper.cleanup();
  });
});