/**
 * Test Database Helper for LCM Service
 * Provides utilities for database testing operations
 */

import { MongoRepository } from 'typeorm';
import { MockDataGenerator } from './mock-data.generator';

export class TestDatabaseHelper {
  
  /**
   * Clean up test data from database
   */
  static async cleanup(repositories: { [key: string]: MongoRepository<any> }): Promise<void> {
    const cleanupPromises = [];
    
    for (const [name, repository] of Object.entries(repositories)) {
      try {
        // Only clean up test data (codes starting with TEST_ or containing test identifiers)
        cleanupPromises.push(
          repository.deleteMany({
            $or: [
              { code: { $regex: /^(PTN|CUS|CON|STF|TXN).*_test$/i } },
              { code: { $regex: /^TEST_/ } },
              { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } // Last 24 hours
            ]
          })
        );
      } catch (error) {
        console.warn(`Failed to cleanup ${name}:`, error.message);
      }
    }
    
    await Promise.all(cleanupPromises);
  }

  /**
   * Setup test data for specific test scenarios
   */
  static async setupDebtCollectionScenario(repositories: {
    partnerRepository: MongoRepository<any>;
    customerRepository: MongoRepository<any>;
    contractRepository: MongoRepository<any>;
    staffRepository: MongoRepository<any>;
    callRepository?: MongoRepository<any>;
    transactionRepository?: MongoRepository<any>;
    activityRepository?: MongoRepository<any>;
  }): Promise<any> {
    
    const scenario = MockDataGenerator.generateDebtCollectionScenario();
    
    // Add test suffix to identify test data
    Object.keys(scenario).forEach(key => {
      if (scenario[key].code) {
        scenario[key].code += '_test';
      }
    });

    // Create partner first
    const partner = await repositories.partnerRepository.save(scenario.partner);
    
    // Create staff
    const staff = await repositories.staffRepository.save({
      ...scenario.staff,
      partnerCode: partner.code
    });
    
    // Create customer
    const customer = await repositories.customerRepository.save({
      ...scenario.customer,
      partnerCode: partner.code,
      callStaffCode: staff.code
    });
    
    // Create contract
    const contract = await repositories.contractRepository.save({
      ...scenario.contract,
      customerCode: customer.code,
      partnerCode: partner.code
    });

    const result: any = {
      partner,
      staff,
      customer,
      contract
    };

    // Create optional entities if repositories provided
    if (repositories.callRepository) {
      result.call = await repositories.callRepository.save({
        ...scenario.call,
        customerCode: customer.code,
        partnerCode: partner.code,
        staffCode: staff.code
      });
    }

    if (repositories.transactionRepository) {
      result.transaction = await repositories.transactionRepository.save({
        ...scenario.transaction,
        customerCode: customer.code,
        contractCode: contract.code,
        partnerCode: partner.code,
        staffCode: staff.code
      });
    }

    if (repositories.activityRepository) {
      result.activity = await repositories.activityRepository.save({
        ...scenario.activity,
        customerCode: customer.code,
        staffCode: staff.code,
        partnerCode: partner.code
      });
    }

    return result;
  }

  /**
   * Create bulk test data for performance testing
   */
  static async setupBulkTestData(
    repository: MongoRepository<any>, 
    type: string, 
    count: number, 
    overrides: any = {}
  ): Promise<any[]> {
    const bulkData = MockDataGenerator.generateBulkData(type, count, {
      ...overrides,
      // Add test suffix for easy cleanup
      code: overrides.code ? `${overrides.code}_test` : undefined
    });

    // Add test identifiers
    bulkData.forEach((item, index) => {
      if (item.code) {
        item.code = `${item.code}_bulk_${index}_test`;
      }
    });

    return await repository.save(bulkData);
  }

  /**
   * Verify test data integrity
   */
  static async verifyDataIntegrity(testData: any): Promise<boolean> {
    try {
      // Verify partner exists
      if (!testData.partner || !testData.partner.code) {
        throw new Error('Partner data missing or invalid');
      }

      // Verify customer-partner relationship
      if (!testData.customer || testData.customer.partnerCode !== testData.partner.code) {
        throw new Error('Customer-Partner relationship invalid');
      }

      // Verify contract relationships
      if (!testData.contract || 
          testData.contract.customerCode !== testData.customer.code ||
          testData.contract.partnerCode !== testData.partner.code) {
        throw new Error('Contract relationships invalid');
      }

      // Verify staff-partner relationship
      if (!testData.staff || testData.staff.partnerCode !== testData.partner.code) {
        throw new Error('Staff-Partner relationship invalid');
      }

      // Verify optional entities if present
      if (testData.call) {
        if (testData.call.customerCode !== testData.customer.code ||
            testData.call.partnerCode !== testData.partner.code ||
            testData.call.staffCode !== testData.staff.code) {
          throw new Error('Call relationships invalid');
        }
      }

      if (testData.transaction) {
        if (testData.transaction.customerCode !== testData.customer.code ||
            testData.transaction.contractCode !== testData.contract.code ||
            testData.transaction.partnerCode !== testData.partner.code ||
            testData.transaction.staffCode !== testData.staff.code) {
          throw new Error('Transaction relationships invalid');
        }
      }

      return true;
    } catch (error) {
      console.error('Data integrity verification failed:', error.message);
      return false;
    }
  }

  /**
   * Generate test assertion helpers
   */
  static createAssertionHelpers() {
    return {
      assertPartnerExists: (partner: any) => {
        expect(partner).toBeDefined();
        expect(partner.code).toBeDefined();
        expect(partner.name).toBeDefined();
        expect(partner.status).toBeDefined();
      },

      assertCustomerExists: (customer: any) => {
        expect(customer).toBeDefined();
        expect(customer.code).toBeDefined();
        expect(customer.fullname).toBeDefined();
        expect(customer.partnerCode).toBeDefined();
        expect(customer.status).toBeDefined();
      },

      assertContractExists: (contract: any) => {
        expect(contract).toBeDefined();
        expect(contract.code).toBeDefined();
        expect(contract.customerCode).toBeDefined();
        expect(contract.partnerCode).toBeDefined();
        expect(contract.originalAmount).toBeGreaterThan(0);
      },

      assertCallExists: (call: any) => {
        expect(call).toBeDefined();
        expect(call.customerCode).toBeDefined();
        expect(call.staffCode).toBeDefined();
        expect(call.phoneNumber).toBeDefined();
        expect(call.callType).toBeDefined();
      },

      assertTransactionExists: (transaction: any) => {
        expect(transaction).toBeDefined();
        expect(transaction.customerCode).toBeDefined();
        expect(transaction.contractCode).toBeDefined();
        expect(transaction.amount).toBeGreaterThan(0);
        expect(transaction.transactionType).toBeDefined();
      },

      assertRelationshipsValid: (testData: any) => {
        expect(testData.customer.partnerCode).toBe(testData.partner.code);
        expect(testData.contract.customerCode).toBe(testData.customer.code);
        expect(testData.contract.partnerCode).toBe(testData.partner.code);
        expect(testData.staff.partnerCode).toBe(testData.partner.code);
      }
    };
  }
}