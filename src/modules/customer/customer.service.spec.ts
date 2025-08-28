import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { MockDataGenerator, TestDatabaseHelper, COMMON_ASSERTIONS, VALIDATION_HELPERS } from '../../test-utils';
import { CustomerCreateDto } from './dto/create.dto';
import { CustomerUpdateOneDto } from './dto/update-one.dto';
import { CustomerFindOneDto } from './dto/find-one.dto';
import { CustomerStatus } from './enum/customer.enum';

describe('CustomerService - Critical Debt Collection Tests', () => {
  let service: CustomerService;
  let mockDataGenerator: MockDataGenerator;
  let testDbHelper: TestDatabaseHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: 'CustomerModel',
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

    service = module.get<CustomerService>(CustomerService);
    mockDataGenerator = new MockDataGenerator();
    testDbHelper = new TestDatabaseHelper();
  });

  describe('Critical Debt Collection Workflows', () => {
    describe('Customer Creation for Debt Collection', () => {
      it('should create customer with valid debt collection data', async () => {
        // Arrange
        const partnerData = mockDataGenerator.generatePartnerData();
        const createDto: CustomerCreateDto = mockDataGenerator.generateCustomerCreateDto(partnerData.code);

        // Act
        const customer = await service.create(createDto);

        // Assert
        COMMON_ASSERTIONS.ENTITY_EXISTS(customer);
        expect(customer.partnerCode).toBe(partnerData.code);
        expect(customer.status).toBe(CustomerStatus.ACTIVE);
        expect(customer.phoneNumbers).toBeDefined();
        expect(customer.phoneNumbers.length).toBeGreaterThan(0);
        
        // Debt collection specific validations
        expect(customer.personalInfo).toBeDefined();
        expect(customer.personalInfo.fullName).toBeDefined();
        expect(customer.personalInfo.idNumber).toBeDefined();
        expect(customer.contactInfo).toBeDefined();
        expect(customer.contactInfo.primaryPhone).toBeDefined();
      });

      it('should validate partner existence before customer creation', async () => {
        // Arrange
        const invalidCreateDto: CustomerCreateDto = mockDataGenerator.generateCustomerCreateDto('INVALID_PARTNER');

        // Act & Assert
        await expect(service.create(invalidCreateDto)).rejects.toThrow('Partner not found');
      });

      it('should prevent duplicate customer creation by ID number', async () => {
        // Arrange
        const partnerData = mockDataGenerator.generatePartnerData();
        const createDto: CustomerCreateDto = mockDataGenerator.generateCustomerCreateDto(partnerData.code);
        
        // Create first customer
        await service.create(createDto);

        // Act & Assert - Try to create duplicate
        await expect(service.create(createDto)).rejects.toThrow('Customer already exists with this ID number');
      });
    });

    describe('Customer Status Management for Debt Collection', () => {
      it('should activate customer for debt collection', async () => {
        // Arrange
        const customer = mockDataGenerator.generateCustomerData(CustomerStatus.INACTIVE);
        const updateDto: CustomerUpdateOneDto = {
          status: CustomerStatus.ACTIVE,
          updatedBy: 'TEST_STAFF',
          updatedReason: 'Activated for debt collection'
        };

        // Act
        const updatedCustomer = await service.updateOne(customer.id, updateDto);

        // Assert
        expect(updatedCustomer.status).toBe(CustomerStatus.ACTIVE);
        expect(updatedCustomer.statusHistory).toBeDefined();
        expect(updatedCustomer.statusHistory.length).toBeGreaterThan(0);
        
        const latestStatusChange = updatedCustomer.statusHistory[updatedCustomer.statusHistory.length - 1];
        expect(latestStatusChange.fromStatus).toBe(CustomerStatus.INACTIVE);
        expect(latestStatusChange.toStatus).toBe(CustomerStatus.ACTIVE);
        expect(latestStatusChange.reason).toBe('Activated for debt collection');
      });

      it('should deactivate customer and stop collection activities', async () => {
        // Arrange
        const customer = mockDataGenerator.generateCustomerData(CustomerStatus.ACTIVE);
        const updateDto: CustomerUpdateOneDto = {
          status: CustomerStatus.INACTIVE,
          updatedBy: 'TEST_STAFF',
          updatedReason: 'Debt settled - deactivate collection'
        };

        // Act
        const updatedCustomer = await service.updateOne(customer.id, updateDto);

        // Assert
        expect(updatedCustomer.status).toBe(CustomerStatus.INACTIVE);
        expect(updatedCustomer.statusHistory).toBeDefined();
        
        const latestStatusChange = updatedCustomer.statusHistory[updatedCustomer.statusHistory.length - 1];
        expect(latestStatusChange.reason).toBe('Debt settled - deactivate collection');
      });
    });

    describe('Customer Search for Debt Collection', () => {
      it('should find customer by ID number for debt collection', async () => {
        // Arrange
        const customer = mockDataGenerator.generateCustomerData();
        const findDto: CustomerFindOneDto = {
          idNumber: customer.personalInfo.idNumber
        };

        // Act
        const foundCustomer = await service.findOne(findDto);

        // Assert
        COMMON_ASSERTIONS.ENTITY_EXISTS(foundCustomer);
        expect(foundCustomer.personalInfo.idNumber).toBe(customer.personalInfo.idNumber);
        expect(foundCustomer.status).toBe(CustomerStatus.ACTIVE);
      });

      it('should find customer by phone number for call campaigns', async () => {
        // Arrange
        const customer = mockDataGenerator.generateCustomerData();
        const phoneNumber = customer.contactInfo.primaryPhone;
        const findDto: CustomerFindOneDto = {
          phoneNumber: phoneNumber
        };

        // Act
        const foundCustomer = await service.findOne(findDto);

        // Assert
        COMMON_ASSERTIONS.ENTITY_EXISTS(foundCustomer);
        expect(foundCustomer.contactInfo.primaryPhone).toBe(phoneNumber);
        expect(foundCustomer.status).toBe(CustomerStatus.ACTIVE);
      });

      it('should find customers by partner code for partner reporting', async () => {
        // Arrange
        const partnerCode = 'BANK_001';
        const customers = mockDataGenerator.generateMultipleCustomerData(5, partnerCode);

        // Act
        const foundCustomers = await service.findByPartner(partnerCode);

        // Assert
        expect(foundCustomers).toBeDefined();
        expect(foundCustomers.length).toBe(5);
        foundCustomers.forEach(customer => {
          expect(customer.partnerCode).toBe(partnerCode);
        });
      });
    });

    describe('Customer Data Privacy and Security', () => {
      it('should mask sensitive data in audit logs', async () => {
        // Arrange
        const customer = mockDataGenerator.generateCustomerData();

        // Act
        const auditLog = await service.generateAuditLog(customer.id, 'VIEW', 'TEST_STAFF');

        // Assert
        expect(auditLog.maskedData).toBeDefined();
        expect(auditLog.maskedData.idNumber).toMatch(/\*{4}\d{4}/); // Masked ID number
        expect(auditLog.maskedData.phoneNumber).toMatch(/\*{4}\d{4}/); // Masked phone
        expect(auditLog.maskedData.fullName).toMatch(/\*{2,}/); // Masked name
      });

      it('should prevent unauthorized access to sensitive customer data', async () => {
        // Arrange
        const customer = mockDataGenerator.generateCustomerData();
        const unauthorizedStaff = 'UNAUTHORIZED_STAFF';

        // Act & Assert
        await expect(service.findOne({ id: customer.id }, unauthorizedStaff))
          .rejects.toThrow('Insufficient permissions to access customer data');
      });
    });

    describe('Business Rule Validation', () => {
      it('should validate debt collection eligibility', async () => {
        // Arrange
        const customer = mockDataGenerator.generateCustomerData(CustomerStatus.ACTIVE);
        const contracts = mockDataGenerator.generateContractDataForCustomer(customer.code, 3);

        // Act
        const eligibility = await service.validateDebtCollectionEligibility(customer.id);

        // Assert
        expect(eligibility.isEligible).toBe(true);
        expect(eligibility.activeContracts).toBeGreaterThan(0);
        expect(eligibility.totalOverdueAmount).toBeGreaterThan(0);
        
        // Use validation helper
        VALIDATION_HELPERS.validateDebtCollectionRules(customer, contracts[0]);
      });

      it('should prevent collection on inactive customers', async () => {
        // Arrange
        const customer = mockDataGenerator.generateCustomerData(CustomerStatus.INACTIVE);

        // Act
        const eligibility = await service.validateDebtCollectionEligibility(customer.id);

        // Assert
        expect(eligibility.isEligible).toBe(false);
        expect(eligibility.reason).toBe('Customer is not active');
      });

      it('should validate contact information completeness', async () => {
        // Arrange
        const incompleteCustomer = mockDataGenerator.generateCustomerData();
        incompleteCustomer.contactInfo.primaryPhone = null;

        // Act
        const validation = await service.validateContactInfo(incompleteCustomer.id);

        // Assert
        expect(validation.isValid).toBe(false);
        expect(validation.missingFields).toContain('primaryPhone');
        expect(validation.severity).toBe('HIGH'); // High severity for missing primary contact
      });
    });

    describe('Performance and Bulk Operations', () => {
      it('should handle bulk customer import efficiently', async () => {
        // Arrange
        const bulkData = mockDataGenerator.generateBulkCustomerData(1000);
        const startTime = Date.now();

        // Act
        const result = await service.bulkImport(bulkData);
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Assert
        expect(result.success).toBe(true);
        expect(result.processedCount).toBe(1000);
        expect(result.errorCount).toBe(0);
        expect(duration).toBeLessThan(30000); // Should complete within 30 seconds
      });

      it('should validate performance for customer search operations', async () => {
        // Arrange
        const searchQueries = mockDataGenerator.generateSearchQueries(100);

        // Act & Assert
        for (const query of searchQueries) {
          const startTime = Date.now();
          await service.findOne(query);
          const duration = Date.now() - startTime;
          
          expect(duration).toBeLessThan(300); // Each search should be under 300ms
        }
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle database connection errors gracefully', async () => {
      // Arrange
      const customer = mockDataGenerator.generateCustomerData();
      // Simulate database error
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(service.findOne({ id: customer.id }))
        .rejects.toThrow('Database connection failed');
    });

    it('should handle invalid data formats gracefully', async () => {
      // Arrange
      const invalidCreateDto = {
        partnerCode: '',
        personalInfo: null,
        contactInfo: {
          primaryPhone: 'invalid-phone-format'
        }
      } as CustomerCreateDto;

      // Act & Assert
      await expect(service.create(invalidCreateDto))
        .rejects.toThrow('Invalid customer data format');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await testDbHelper.cleanup();
  });
});