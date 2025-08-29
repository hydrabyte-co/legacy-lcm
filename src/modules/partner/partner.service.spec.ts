import { Test, TestingModule } from '@nestjs/testing';
import { PartnerService } from './partner.service';
import { MockDataGenerator, TestDatabaseHelper, COMMON_ASSERTIONS, VALIDATION_HELPERS } from '../../test-utils';
import { PartnerCreateDto } from './dto/create.dto';
import { PartnerUpdateOneDto } from './dto/update-one.dto';
import { PartnerFindOneDto } from './dto/find-one.dto';
import { PartnerStatus, PartnerType } from './enum/partner.enum';

describe('PartnerService - Critical Debt Collection Tests', () => {
  let service: PartnerService;
  let mockDataGenerator: MockDataGenerator;
  let testDbHelper: TestDatabaseHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnerService,
        {
          provide: 'PartnerModel',
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

    service = module.get<PartnerService>(PartnerService);
    mockDataGenerator = new MockDataGenerator();
    testDbHelper = new TestDatabaseHelper();
  });

  describe('Partner Management for Financial Institutions', () => {
    describe('Partner Registration and Setup', () => {
      it('should create financial partner with complete debt collection setup', async () => {
        // Arrange
        const createDto: PartnerCreateDto = {
          code: 'BANK_001',
          name: 'Test Commercial Bank',
          type: PartnerType.COMMERCIAL_BANK,
          contactInfo: {
            contactPerson: 'John Banking Manager',
            email: 'manager@testbank.com',
            phone: '0901234567',
            address: '123 Banking Street, Financial District'
          },
          debtCollectionSettings: {
            allowAutoDialer: true,
            allowClickToCall: true,
            maxCallsPerDay: 3,
            collectionStartHour: 8,
            collectionEndHour: 18,
            weekendCollection: false,
            holidayCollection: false
          },
          slaAgreement: {
            responseTimeMinutes: 120,
            resolutionTimeHours: 24,
            monthlyReportDeadline: 5,
            performanceTargets: {
              contactRate: 0.80,
              resolutionRate: 0.60,
              recoveryRate: 0.45
            }
          },
          paymentSettings: {
            allowPartialPayments: true,
            minimumPaymentAmount: 100000,
            paymentMethods: ['BANK_TRANSFER', 'CASH', 'CHECK'],
            autoReconciliation: true
          },
          createdBy: 'TEST_ADMIN'
        };

        // Act
        const partner = await service.create(createDto);

        // Assert
        COMMON_ASSERTIONS.ENTITY_EXISTS(partner);
        COMMON_ASSERTIONS.VALID_CODE_FORMAT(partner.code, 'BANK_');
        expect(partner.status).toBe(PartnerStatus.ACTIVE);
        expect(partner.type).toBe(PartnerType.COMMERCIAL_BANK);
        
        // Debt collection specific validations
        expect(partner.debtCollectionSettings).toBeDefined();
        expect(partner.debtCollectionSettings.maxCallsPerDay).toBe(3);
        expect(partner.slaAgreement).toBeDefined();
        expect(partner.slaAgreement.performanceTargets).toBeDefined();
        expect(partner.paymentSettings).toBeDefined();
      });

      it('should validate partner code uniqueness', async () => {
        // Arrange
        const createDto = mockDataGenerator.generatePartnerCreateDto();
        await service.create(createDto);

        // Act & Assert - Try to create partner with same code
        await expect(service.create(createDto))
          .rejects.toThrow('Partner code already exists');
      });

      it('should validate SLA agreement parameters', async () => {
        // Arrange
        const createDto = mockDataGenerator.generatePartnerCreateDto();
        createDto.slaAgreement.performanceTargets.contactRate = 1.5; // Invalid > 1.0

        // Act & Assert
        await expect(service.create(createDto))
          .rejects.toThrow('Invalid SLA performance targets');
      });
    });

    describe('Partner Configuration Management', () => {
      it('should update debt collection settings', async () => {
        // Arrange
        const partner = mockDataGenerator.generatePartnerData();
        const updateDto: PartnerUpdateOneDto = {
          debtCollectionSettings: {
            maxCallsPerDay: 5,
            allowAutoDialer: false,
            collectionStartHour: 9,
            collectionEndHour: 17
          },
          updatedBy: 'TEST_ADMIN',
          updateReason: 'Update call limits per partner request'
        };

        // Act
        const updatedPartner = await service.updateOne(partner.id, updateDto);

        // Assert
        expect(updatedPartner.debtCollectionSettings.maxCallsPerDay).toBe(5);
        expect(updatedPartner.debtCollectionSettings.allowAutoDialer).toBe(false);
        expect(updatedPartner.configurationHistory).toBeDefined();
        
        const latestConfig = updatedPartner.configurationHistory[updatedPartner.configurationHistory.length - 1];
        expect(latestConfig.changes).toContain('debtCollectionSettings');
        expect(latestConfig.reason).toBe('Update call limits per partner request');
      });

      it('should validate business hours configuration', async () => {
        // Arrange
        const partner = mockDataGenerator.generatePartnerData();
        const updateDto: PartnerUpdateOneDto = {
          debtCollectionSettings: {
            collectionStartHour: 22, // Invalid - too late
            collectionEndHour: 6     // Invalid - too early
          },
          updatedBy: 'TEST_ADMIN'
        };

        // Act & Assert
        await expect(service.updateOne(partner.id, updateDto))
          .rejects.toThrow('Invalid business hours configuration');
      });
    });

    describe('Partner Performance Monitoring', () => {
      it('should track partner performance metrics', async () => {
        // Arrange
        const partner = mockDataGenerator.generatePartnerData();
        const performanceData = {
          month: '2025-01',
          totalCustomers: 1000,
          contactedCustomers: 800,
          resolvedCases: 600,
          totalRecovered: 1500000000, // 1.5 billion VND
          averageResponseTime: 90 // minutes
        };

        // Act
        const performance = await service.updatePerformanceMetrics(partner.id, performanceData);

        // Assert
        expect(performance.contactRate).toBe(0.80); // 800/1000
        expect(performance.resolutionRate).toBe(0.60); // 600/1000
        expect(performance.recoveryRate).toBeGreaterThan(0);
        expect(performance.slaCompliance.responseTime).toBe(true); // 90 < 120 minutes
        
        // Validate against SLA targets
        expect(performance.contactRate).toBeGreaterThanOrEqual(partner.slaAgreement.performanceTargets.contactRate);
      });

      it('should generate SLA compliance report', async () => {
        // Arrange
        const partner = mockDataGenerator.generatePartnerData();
        const reportPeriod = { from: '2025-01-01', to: '2025-01-31' };

        // Act
        const slaReport = await service.generateSLAReport(partner.id, reportPeriod);

        // Assert
        expect(slaReport.partner.code).toBe(partner.code);
        expect(slaReport.period).toEqual(reportPeriod);
        expect(slaReport.compliance).toBeDefined();
        expect(slaReport.compliance.responseTime).toBeDefined();
        expect(slaReport.compliance.resolutionTime).toBeDefined();
        expect(slaReport.compliance.monthlyReporting).toBeDefined();
        expect(slaReport.recommendations).toBeDefined();
      });

      it('should detect and alert on SLA violations', async () => {
        // Arrange
        const partner = mockDataGenerator.generatePartnerData();
        const poorPerformanceData = {
          month: '2025-01',
          totalCustomers: 1000,
          contactedCustomers: 500, // Below 80% target
          resolvedCases: 300,      // Below 60% target
          averageResponseTime: 180 // Above 120 minute limit
        };

        // Act
        const violation = await service.checkSLAViolations(partner.id, poorPerformanceData);

        // Assert
        expect(violation.hasViolations).toBe(true);
        expect(violation.violations).toContain('LOW_CONTACT_RATE');
        expect(violation.violations).toContain('LOW_RESOLUTION_RATE');
        expect(violation.violations).toContain('RESPONSE_TIME_EXCEEDED');
        expect(violation.severity).toBe('HIGH');
        expect(violation.actionRequired).toBe(true);
      });
    });

    describe('Partner Data Integration', () => {
      it('should validate customer data upload from partner', async () => {
        // Arrange
        const partner = mockDataGenerator.generatePartnerData();
        const uploadData = mockDataGenerator.generatePartnerDataUpload(partner.code, 100);

        // Act
        const validation = await service.validateDataUpload(partner.id, uploadData);

        // Assert
        expect(validation.isValid).toBe(true);
        expect(validation.totalRecords).toBe(100);
        expect(validation.validRecords).toBe(100);
        expect(validation.invalidRecords).toBe(0);
        expect(validation.duplicateRecords).toBe(0);
        
        // Validate partner relationship integrity
        VALIDATION_HELPERS.validatePartnerRelationships(
          partner, 
          uploadData.customers, 
          uploadData.contracts
        );
      });

      it('should reject invalid customer data format', async () => {
        // Arrange
        const partner = mockDataGenerator.generatePartnerData();
        const invalidUploadData = mockDataGenerator.generateInvalidPartnerDataUpload(partner.code);

        // Act
        const validation = await service.validateDataUpload(partner.id, invalidUploadData);

        // Assert
        expect(validation.isValid).toBe(false);
        expect(validation.invalidRecords).toBeGreaterThan(0);
        expect(validation.errors).toBeDefined();
        expect(validation.errors.length).toBeGreaterThan(0);
        expect(validation.errors[0]).toMatch(/Invalid data format/);
      });

      it('should process bulk customer data efficiently', async () => {
        // Arrange
        const partner = mockDataGenerator.generatePartnerData();
        const bulkData = mockDataGenerator.generatePartnerDataUpload(partner.code, 5000);
        const startTime = Date.now();

        // Act
        const result = await service.processBulkDataUpload(partner.id, bulkData);
        const duration = Date.now() - startTime;

        // Assert
        expect(result.success).toBe(true);
        expect(result.processedRecords).toBe(5000);
        expect(result.failedRecords).toBe(0);
        expect(duration).toBeLessThan(60000); // Should complete within 60 seconds
        
        // Verify data integrity
        const uploadedCustomers = await service.getPartnerCustomers(partner.id);
        expect(uploadedCustomers.length).toBe(5000);
      });
    });

    describe('Partner Status and Lifecycle Management', () => {
      it('should activate partner for debt collection operations', async () => {
        // Arrange
        const partner = mockDataGenerator.generatePartnerData(PartnerStatus.PENDING);
        const updateDto: PartnerUpdateOneDto = {
          status: PartnerStatus.ACTIVE,
          updatedBy: 'TEST_ADMIN',
          updateReason: 'All setup completed - activate for operations'
        };

        // Act
        const activatedPartner = await service.updateOne(partner.id, updateDto);

        // Assert
        expect(activatedPartner.status).toBe(PartnerStatus.ACTIVE);
        expect(activatedPartner.statusHistory).toBeDefined();
        expect(activatedPartner.activatedAt).toBeDefined();
        
        const statusChange = activatedPartner.statusHistory[activatedPartner.statusHistory.length - 1];
        expect(statusChange.fromStatus).toBe(PartnerStatus.PENDING);
        expect(statusChange.toStatus).toBe(PartnerStatus.ACTIVE);
      });

      it('should suspend partner and halt collection activities', async () => {
        // Arrange
        const partner = mockDataGenerator.generatePartnerData(PartnerStatus.ACTIVE);
        const updateDto: PartnerUpdateOneDto = {
          status: PartnerStatus.SUSPENDED,
          updatedBy: 'TEST_ADMIN',
          updateReason: 'SLA violations - temporary suspension'
        };

        // Act
        const suspendedPartner = await service.updateOne(partner.id, updateDto);

        // Assert
        expect(suspendedPartner.status).toBe(PartnerStatus.SUSPENDED);
        expect(suspendedPartner.suspensionReason).toBe('SLA violations - temporary suspension');
        expect(suspendedPartner.suspendedAt).toBeDefined();
        
        // Verify collection activities are halted
        const activeCollections = await service.getActiveCollectionActivities(partner.id);
        expect(activeCollections.length).toBe(0);
      });
    });

    describe('Partner Reporting and Analytics', () => {
      it('should generate monthly partner performance report', async () => {
        // Arrange
        const partner = mockDataGenerator.generatePartnerData();
        const reportMonth = '2025-01';

        // Act
        const report = await service.generateMonthlyReport(partner.id, reportMonth);

        // Assert
        expect(report.partner.code).toBe(partner.code);
        expect(report.period).toBe(reportMonth);
        expect(report.summary).toBeDefined();
        expect(report.summary.totalCustomers).toBeGreaterThan(0);
        expect(report.summary.totalContracts).toBeGreaterThan(0);
        expect(report.summary.totalOutstanding).toBeGreaterThan(0);
        expect(report.performance).toBeDefined();
        expect(report.activities).toBeDefined();
        expect(report.recommendations).toBeDefined();
      });

      it('should calculate financial recovery metrics', async () => {
        // Arrange
        const partner = mockDataGenerator.generatePartnerData();
        const period = { from: '2025-01-01', to: '2025-01-31' };

        // Act
        const metrics = await service.calculateFinancialMetrics(partner.id, period);

        // Assert
        expect(metrics.totalOutstanding).toBeGreaterThan(0);
        expect(metrics.totalRecovered).toBeGreaterThan(0);
        expect(metrics.recoveryRate).toBeGreaterThan(0);
        expect(metrics.recoveryRate).toBeLessThanOrEqual(1);
        expect(metrics.averageRecoveryTime).toBeGreaterThan(0);
        expect(metrics.costPerRecovery).toBeGreaterThan(0);
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle partner configuration conflicts gracefully', async () => {
      // Arrange
      const partner = mockDataGenerator.generatePartnerData();
      const conflictingUpdate: PartnerUpdateOneDto = {
        debtCollectionSettings: {
          allowAutoDialer: true,
          maxCallsPerDay: 0 // Conflict: auto dialer enabled but no calls allowed
        },
        updatedBy: 'TEST_ADMIN'
      };

      // Act & Assert
      await expect(service.updateOne(partner.id, conflictingUpdate))
        .rejects.toThrow('Configuration conflict: Auto dialer enabled but no calls allowed');
    });

    it('should handle external API failures gracefully', async () => {
      // Arrange
      const partner = mockDataGenerator.generatePartnerData();
      // Simulate external API failure
      jest.spyOn(service, 'syncWithExternalSystem').mockRejectedValue(new Error('External API unavailable'));

      // Act & Assert
      const result = await service.attemptExternalSync(partner.id);
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/External API unavailable/);
      expect(result.retryScheduled).toBe(true);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testDbHelper.cleanup();
  });
});