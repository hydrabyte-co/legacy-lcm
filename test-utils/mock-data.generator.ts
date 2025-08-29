/**
 * Mock Data Generator for LCM Service Testing
 * Generates realistic test data for debt collection operations
 */

import { CustomerStatus } from '../modules/customer/enum/customer.enum';
import { PartnerStatus } from '../modules/partner/enum/partner.enum';
import { ContractStatus } from '../modules/contract/enum/contract.enum';

export class MockDataGenerator {
  
  /**
   * Generate mock partner data for testing
   */
  static generatePartner(overrides: Partial<any> = {}): any {
    return {
      code: `PTN${Date.now()}`,
      businessCode: `BIZ${Math.random().toString(36).substr(2, 8)}`,
      contractCode: `CTR${Math.random().toString(36).substr(2, 8)}`,
      name: 'Test Financial Institution',
      address: '123 Financial Street, Hanoi',
      representative: 'Test Representative',
      phone: '024-1234-5678',
      email: 'test@financial.com',
      status: PartnerStatus.Active,
      contractStartDate: new Date().toISOString(),
      contractEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      ...overrides
    };
  }

  /**
   * Generate mock customer data for testing
   */
  static generateCustomer(overrides: Partial<any> = {}): any {
    return {
      code: `CUS${Date.now()}`,
      partnerCode: `PTN${Date.now()}`,
      callStaffCode: `STF${Math.random().toString(36).substr(2, 6)}`,
      fieldStaffCode: `STF${Math.random().toString(36).substr(2, 6)}`,
      fullname: 'Nguyen Van Test',
      gender: 'Male',
      dob: '1990-01-01',
      identityNumber: '123456789012',
      mobileNumber: '0987654321',
      officeNumber: '024-9876543',
      email: 'test.customer@email.com',
      temporaryAddress: '456 Temporary Street, Hanoi',
      permanentAddress: '789 Permanent Street, Hanoi',
      officeAddress: '101 Office Building, Hanoi',
      officeName: 'Test Company Ltd',
      jobPosition: 'Manager',
      businessDomain: 'Technology',
      status: CustomerStatus.Active,
      note: 'Test customer for debt collection',
      priority: 1,
      ...overrides
    };
  }

  /**
   * Generate mock contract data for testing
   */
  static generateContract(overrides: Partial<any> = {}): any {
    return {
      code: `CON${Date.now()}`,
      customerCode: `CUS${Date.now()}`,
      partnerCode: `PTN${Date.now()}`,
      contractNumber: `CTN${Math.random().toString(36).substr(2, 10)}`,
      productCode: 'LOAN001',
      productName: 'Personal Loan',
      originalAmount: 10000000,
      currentBalance: 8500000,
      overdueAmount: 1500000,
      overdueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      overdueDays: 30,
      interestRate: 1.5,
      penaltyRate: 2.0,
      status: ContractStatus.Active,
      startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastPaymentDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      lastPaymentAmount: 500000,
      notes: 'Test contract for debt collection testing',
      ...overrides
    };
  }

  /**
   * Generate mock call data for testing
   */
  static generateCall(overrides: Partial<any> = {}): any {
    return {
      customerCode: `CUS${Date.now()}`,
      partnerCode: `PTN${Date.now()}`,
      staffCode: `STF${Math.random().toString(36).substr(2, 6)}`,
      phoneNumber: '0987654321',
      callType: 'click-to-call',
      callStatus: 'completed',
      callResult: 'promise-to-pay',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 300000).toISOString(),
      duration: 300,
      recording: '/recordings/test-recording.wav',
      notes: 'Customer promised to pay 1,000,000 VND by end of week',
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      promiseToPayAmount: 1000000,
      promiseToPayDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      ...overrides
    };
  }

  /**
   * Generate mock staff data for testing
   */
  static generateStaff(overrides: Partial<any> = {}): any {
    return {
      code: `STF${Math.random().toString(36).substr(2, 6)}`,
      partnerCode: `PTN${Date.now()}`,
      teamCode: `TEA${Math.random().toString(36).substr(2, 6)}`,
      fullname: 'Test Staff Member',
      email: 'test.staff@company.com',
      phone: '0901234567',
      position: 'Collection Agent',
      department: 'Debt Collection',
      status: 'active',
      startDate: new Date().toISOString(),
      skills: ['phone-calls', 'negotiation', 'customer-service'],
      targets: {
        monthlyCallTarget: 500,
        monthlyCollectionTarget: 100000000
      },
      ...overrides
    };
  }

  /**
   * Generate mock transaction data for testing
   */
  static generateTransaction(overrides: Partial<any> = {}): any {
    return {
      customerCode: `CUS${Date.now()}`,
      contractCode: `CON${Date.now()}`,
      partnerCode: `PTN${Date.now()}`,
      staffCode: `STF${Math.random().toString(36).substr(2, 6)}`,
      transactionCode: `TXN${Date.now()}`,
      amount: 1000000,
      transactionType: 'payment',
      paymentMethod: 'bank-transfer',
      paymentChannel: 'internet-banking',
      transactionDate: new Date().toISOString(),
      processedDate: new Date().toISOString(),
      status: 'completed',
      description: 'Debt payment from customer',
      reference: `REF${Math.random().toString(36).substr(2, 10)}`,
      ...overrides
    };
  }

  /**
   * Generate mock activity data for testing
   */
  static generateActivity(overrides: Partial<any> = {}): any {
    return {
      customerCode: `CUS${Date.now()}`,
      staffCode: `STF${Math.random().toString(36).substr(2, 6)}`,
      partnerCode: `PTN${Date.now()}`,
      activityType: 'call',
      description: 'Contacted customer regarding overdue payment',
      result: 'promise-to-pay',
      notes: 'Customer agreed to pay 50% by Friday',
      followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 180,
      ...overrides
    };
  }

  /**
   * Generate bulk test data
   */
  static generateBulkData(type: string, count: number, overrides: Partial<any> = {}): any[] {
    const data = [];
    for (let i = 0; i < count; i++) {
      switch (type) {
        case 'partner':
          data.push(this.generatePartner({ ...overrides, code: `PTN${Date.now()}_${i}` }));
          break;
        case 'customer':
          data.push(this.generateCustomer({ ...overrides, code: `CUS${Date.now()}_${i}` }));
          break;
        case 'contract':
          data.push(this.generateContract({ ...overrides, code: `CON${Date.now()}_${i}` }));
          break;
        case 'call':
          data.push(this.generateCall(overrides));
          break;
        case 'staff':
          data.push(this.generateStaff({ ...overrides, code: `STF${Date.now()}_${i}` }));
          break;
        case 'transaction':
          data.push(this.generateTransaction({ ...overrides, transactionCode: `TXN${Date.now()}_${i}` }));
          break;
        case 'activity':
          data.push(this.generateActivity(overrides));
          break;
        default:
          throw new Error(`Unknown data type: ${type}`);
      }
    }
    return data;
  }

  /**
   * Generate related test data scenario
   */
  static generateDebtCollectionScenario(): any {
    const partner = this.generatePartner();
    const customer = this.generateCustomer({ partnerCode: partner.code });
    const contract = this.generateContract({ 
      customerCode: customer.code, 
      partnerCode: partner.code 
    });
    const staff = this.generateStaff({ partnerCode: partner.code });
    const call = this.generateCall({
      customerCode: customer.code,
      partnerCode: partner.code,
      staffCode: staff.code
    });
    const transaction = this.generateTransaction({
      customerCode: customer.code,
      contractCode: contract.code,
      partnerCode: partner.code,
      staffCode: staff.code
    });
    const activity = this.generateActivity({
      customerCode: customer.code,
      staffCode: staff.code,
      partnerCode: partner.code
    });

    return {
      partner,
      customer,
      contract,
      staff,
      call,
      transaction,
      activity
    };
  }
}