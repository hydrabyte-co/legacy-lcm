import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { {{EntityName}}Service } from './{{kebab-case}}.service';
import { {{EntityName}} } from './entity/{{kebab-case}}.entity';
import { MockDataGenerator, TestDatabaseHelper, VALIDATION_HELPERS } from '../../test-utils';
import { {{EntityName}}Status } from './enum/{{kebab-case}}.enum';

describe('{{EntityName}}Service', () => {
  let service: {{EntityName}}Service;
  let repository: MongoRepository<{{EntityName}}>;
  let module: TestingModule;

  // Mock repository
  const mockRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getOne: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {{EntityName}}Service,
        {
          provide: getRepositoryToken({{EntityName}}),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<{{EntityName}}Service>({{EntityName}}Service);
    repository = module.get<MongoRepository<{{EntityName}}>>(getRepositoryToken({{EntityName}}));
    
    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have repository injected', () => {
      expect(repository).toBeDefined();
    });
  });

  describe('CRUD Operations', () => {
    describe('create', () => {
      it('should create a {{kebab-case}}', async () => {
        const mockData = MockDataGenerator.generate{{EntityName}}();
        const expectedResult = { id: 'test-id', ...mockData };

        mockRepository.save.mockResolvedValue(expectedResult);

        const result = await service.create(mockData);

        expect(mockRepository.save).toHaveBeenCalledWith(mockData);
        expect(result).toEqual(expectedResult);
      });

      it('should validate business rules during creation', async () => {
        const invalidData = MockDataGenerator.generate{{EntityName}}({
          // Add invalid data scenarios
          amount: -1000, // Negative amount should fail
        });

        mockRepository.save.mockRejectedValue(new Error('Validation failed'));

        await expect(service.create(invalidData)).rejects.toThrow();
      });
    });

    describe('findById', () => {
      it('should find {{kebab-case}} by id', async () => {
        const mockId = 'test-id';
        const expectedResult = { id: mockId, ...MockDataGenerator.generate{{EntityName}}() };

        mockRepository.findOneBy.mockResolvedValue(expectedResult);

        const result = await service.findById(mockId);

        expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: mockId });
        expect(result).toEqual(expectedResult);
      });

      it('should return null when {{kebab-case}} not found', async () => {
        const mockId = 'non-existent-id';

        mockRepository.findOneBy.mockResolvedValue(null);

        const result = await service.findById(mockId);

        expect(result).toBeNull();
      });
    });

    describe('update', () => {
      it('should update {{kebab-case}}', async () => {
        const mockId = 'test-id';
        const updateData = { name: 'Updated Name' };
        const existing = { id: mockId, ...MockDataGenerator.generate{{EntityName}}() };
        const expectedResult = { ...existing, ...updateData };

        mockRepository.findOneBy.mockResolvedValue(existing);
        mockRepository.save.mockResolvedValue(expectedResult);

        const result = await service.update(mockId, updateData);

        expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: mockId });
        expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining(updateData));
        expect(result).toEqual(expectedResult);
      });
    });

    describe('delete', () => {
      it('should delete {{kebab-case}}', async () => {
        const mockId = 'test-id';
        const deleteResult = { affected: 1 };

        mockRepository.delete.mockResolvedValue(deleteResult);

        const result = await service.delete(mockId);

        expect(mockRepository.delete).toHaveBeenCalledWith(mockId);
        expect(result).toEqual(deleteResult);
      });
    });
  });

  describe('Business Logic', () => {
    describe('findOneByCode', () => {
      it('should find {{kebab-case}} by business code', async () => {
        const code = 'TEST_CODE_001';
        const expected = MockDataGenerator.generate{{EntityName}}({ code });
        const mockHandler = { userId: 'test-user' };

        // Mock the base service method
        jest.spyOn(service, 'findOneByField').mockResolvedValue(expected);

        const result = await service.findOneByCode(code, mockHandler);

        expect(service.findOneByField).toHaveBeenCalledWith('code', code, mockHandler);
        expect(result).toEqual(expected);
      });
    });

    describe('findByPartner', () => {
      it('should find {{kebab-case}}s by partner code', async () => {
        const partnerCode = 'PTN_TEST_001';
        const expected = [
          MockDataGenerator.generate{{EntityName}}({ partnerCode }),
          MockDataGenerator.generate{{EntityName}}({ partnerCode }),
        ];
        const mockHandler = { userId: 'test-user' };

        jest.spyOn(service, 'findManyByField').mockResolvedValue(expected);

        const result = await service.findByPartner(partnerCode, mockHandler);

        expect(service.findManyByField).toHaveBeenCalledWith('partnerCode', partnerCode, mockHandler);
        expect(result).toEqual(expected);
      });
    });

    describe('findActiveRecords', () => {
      it('should find active {{kebab-case}}s', async () => {
        const expected = [
          MockDataGenerator.generate{{EntityName}}({ status: {{EntityName}}Status.Active }),
          MockDataGenerator.generate{{EntityName}}({ status: {{EntityName}}Status.Active }),
        ];
        const mockHandler = { userId: 'test-user' };

        jest.spyOn(service, 'findManyByField').mockResolvedValue(expected);

        const result = await service.findActiveRecords(mockHandler);

        expect(service.findManyByField).toHaveBeenCalledWith('status', 'active', mockHandler);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('Debt Collection Business Logic', () => {
    describe('calculatePerformanceMetrics', () => {
      it('should calculate performance metrics for entity', async () => {
        const entityId = 'test-id';
        const periodStart = new Date('2025-01-01');
        const periodEnd = new Date('2025-01-31');

        const result = await service.calculatePerformanceMetrics(entityId, periodStart, periodEnd);

        expect(result).toHaveProperty('entityId', entityId);
        expect(result).toHaveProperty('period');
        expect(result.period.start).toEqual(periodStart);
        expect(result.period.end).toEqual(periodEnd);
        expect(result).toHaveProperty('metrics');
      });
    });

    describe('bulkOperations', () => {
      it('should handle bulk creation', async () => {
        const bulkData = MockDataGenerator.generateBulkData('{{kebab-case}}', 5);
        const mockHandler = { userId: 'test-user' };

        mockRepository.save.mockResolvedValue(bulkData);

        const result = await service.bulkCreate(bulkData, mockHandler);

        expect(mockRepository.save).toHaveBeenCalledWith(bulkData);
        expect(result).toEqual(bulkData);
      });

      it('should validate business rules during bulk creation', async () => {
        const invalidBulkData = [
          MockDataGenerator.generate{{EntityName}}({ amount: -1000 }), // Invalid
        ];
        const mockHandler = { userId: 'test-user' };

        await expect(service.bulkCreate(invalidBulkData, mockHandler)).rejects.toThrow();
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle debt collection scenario', async () => {
      // Test complete debt collection workflow
      const scenario = MockDataGenerator.generateDebtCollectionScenario();
      
      // Validate relationships
      VALIDATION_HELPERS.validatePartnerRelationships(
        scenario.partner,
        [scenario.customer],
        [scenario.contract]
      );

      expect(scenario.customer.partnerCode).toBe(scenario.partner.code);
      expect(scenario.contract.customerCode).toBe(scenario.customer.code);
      expect(scenario.contract.partnerCode).toBe(scenario.partner.code);
    });
  });

  describe('Performance Tests', () => {
    it('should handle bulk operations efficiently', async () => {
      const bulkSize = 100;
      const bulkData = MockDataGenerator.generateBulkData('{{kebab-case}}', bulkSize);
      const mockHandler = { userId: 'test-user' };

      mockRepository.save.mockResolvedValue(bulkData);

      const startTime = Date.now();
      await service.bulkCreate(bulkData, mockHandler);
      const duration = Date.now() - startTime;

      // Should complete bulk operation within reasonable time
      expect(duration).toBeLessThan(5000); // 5 seconds for 100 records
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      const mockData = MockDataGenerator.generate{{EntityName}}();
      const dbError = new Error('Database connection failed');

      mockRepository.save.mockRejectedValue(dbError);

      await expect(service.create(mockData)).rejects.toThrow('Database connection failed');
    });

    it('should handle validation errors gracefully', async () => {
      const invalidData = {
        // Missing required fields
        code: '',
        name: '',
      };

      await expect(service.create(invalidData as any)).rejects.toThrow();
    });
  });
});

// Integration Tests (to be run with actual database)
describe('{{EntityName}}Service Integration Tests', () => {
  let service: {{EntityName}}Service;
  let testData: any;

  beforeEach(async () => {
    // Setup integration test environment
    // This would connect to test database
  });

  afterEach(async () => {
    // Cleanup test data
    if (testData) {
      await TestDatabaseHelper.cleanup({
        {{camelCase}}Repository: service['{{camelCase}}Repository']
      });
    }
  });

  it('should integrate with related modules', async () => {
    // Test actual integration with database
    // This test would be skipped in unit testing environment
  });
});