import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from '../../common/modules/base/base.service';
import { Automation } from './entity/automation.entity';
import { AutomationType } from './enum/automation.enum';

@Injectable()
export class AutomationService extends BaseService<Automation> {
  constructor(
    @InjectRepository(Automation)
    private readonly automationRepository: MongoRepository<Automation>,
  ) {
    super(automationRepository);
  }

  private validateAutomationConfig(type: AutomationType, config: any): void {
    // Remove type validation since entity already has type
    switch (type) {
      case AutomationType.AutoDialer:
        this.validateAutoDialerConfig(config);
        break;
      default:
        throw new BadRequestException(`Unsupported automation type: ${type}`);
    }
  }

  private validateAutoDialerConfig(config: any): void {
    const required = ['partner', 'staffs', 'phoneNumbers', 'retryAttempts', 'concurrentCallRatio'];
    
    for (const field of required) {
      if (!config[field]) {
        throw new BadRequestException(`Auto Dialer config missing required field: ${field}`);
      }
    }

    // Validate partner object
    if (!config.partner || !config.partner.id) {
      throw new BadRequestException('Auto Dialer config must have a valid partner');
    }

    // Validate staffs array
    if (!Array.isArray(config.staffs) || config.staffs.length === 0) {
      throw new BadRequestException('Auto Dialer config must have at least one staff member');
    }

    // Validate phone numbers array
    if (!Array.isArray(config.phoneNumbers) || config.phoneNumbers.length === 0) {
      throw new BadRequestException('Auto Dialer config must have at least one phone number');
    }

    // Validate concurrent call ratio
    if (config.concurrentCallRatio < 0.5 || config.concurrentCallRatio > 2.0) {
      throw new BadRequestException('Concurrent call ratio must be between 0.5 and 2.0');
    }

    // Validate retry attempts
    if (config.retryAttempts < 1 || config.retryAttempts > 10) {
      throw new BadRequestException('Retry attempts must be between 1 and 10');
    }
  }
}