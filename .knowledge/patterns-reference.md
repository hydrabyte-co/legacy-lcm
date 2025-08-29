# Quick Patterns Reference

## 🏗️ MODULE CREATION PATTERN

### **Complete Module Structure:**
```typescript
// 1. Entity (entity/[feature].entity.ts)
import { BaseEntity } from '../../common/modules/base/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('[feature]')
export class FeatureEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @Column({ type: 'json', nullable: true })
  metadata?: any;
}

// 2. Create DTO (dto/create.dto.ts)
import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeatureDto {
  @ApiProperty({ description: 'Feature name', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Feature description', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  metadata?: any;
}

// 3. Service ([feature].service.ts)
import { Injectable } from '@nestjs/common';
import { BaseService } from '../common/modules/base/base.service';
import { FeatureEntity } from './entity/[feature].entity';
import { CreateFeatureDto } from './dto/create.dto';

@Injectable()
export class FeatureService extends BaseService<FeatureEntity> {
  protected entityClass = FeatureEntity;

  async createFeature(createDto: CreateFeatureDto): Promise<FeatureEntity> {
    return this.create(createDto);
  }

  async findByName(name: string): Promise<FeatureEntity[]> {
    return this.findMany({ where: { name } });
  }
}

// 4. Controller ([feature].controller.ts)  
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseController } from '../common/modules/base/base.controller';
import { FeatureService } from './[feature].service';
import { FeatureEntity } from './entity/[feature].entity';
import { CreateFeatureDto } from './dto/create.dto';
import { AuthGuard } from '../common/guards/auth/auth.guard';

@ApiTags('Feature Management')
@Controller('features')
@UseGuards(AuthGuard)
export class FeatureController extends BaseController<FeatureEntity> {
  constructor(private readonly featureService: FeatureService) {
    super(featureService);
  }

  @Post()
  @ApiOperation({ summary: 'Create new feature' })
  @ApiResponse({ status: 201, type: FeatureEntity })
  async create(@Body() createDto: CreateFeatureDto): Promise<FeatureEntity> {
    return this.featureService.createFeature(createDto);
  }

  @Get('by-name/:name')
  @ApiOperation({ summary: 'Find features by name' })
  async findByName(@Param('name') name: string): Promise<FeatureEntity[]> {
    return this.featureService.findByName(name);
  }
}

// 5. Module ([feature].module.ts)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureController } from './[feature].controller';
import { FeatureService } from './[feature].service';
import { FeatureEntity } from './entity/[feature].entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeatureEntity])],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService],
})
export class FeatureModule {}
```

## 🎨 ENUM DEFINITION PATTERN

```typescript
// enum/[feature].enum.ts
export enum FeatureStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  ARCHIVED = 'archived',
}

export enum FeatureType {
  SYSTEM = 'system',
  USER = 'user',
  ADMIN = 'admin',
}

export enum FeaturePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Usage in Entity
@Column({ type: 'enum', enum: FeatureStatus, default: FeatureStatus.PENDING })
status: FeatureStatus;
```

## 📝 DTO VALIDATION PATTERN

```typescript
// Advanced DTO with comprehensive validation
import { 
  IsString, IsEmail, IsOptional, IsEnum, IsArray, 
  IsNumber, Min, Max, MaxLength, IsDateString,
  ValidateNested, IsUUID, IsPhoneNumber 
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdvancedDto {
  @ApiProperty({ description: 'Unique identifier' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Name', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string;

  @ApiProperty({ description: 'Status', enum: FeatureStatus })
  @IsEnum(FeatureStatus)
  status: FeatureStatus;

  @ApiProperty({ description: 'Priority level', minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  priority: number;

  @ApiPropertyOptional({ description: 'Tags array' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Due date in ISO format' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
```

## 🔧 SERVICE BUSINESS LOGIC PATTERN

```typescript
// Advanced service with business logic
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BaseService } from '../common/modules/base/base.service';
import { FeatureEntity } from './entity/feature.entity';
import { CreateFeatureDto, UpdateFeatureDto } from './dto';
import { FeatureStatus } from './enum/feature.enum';

@Injectable()
export class AdvancedFeatureService extends BaseService<FeatureEntity> {
  protected entityClass = FeatureEntity;

  async createWithValidation(createDto: CreateFeatureDto): Promise<FeatureEntity> {
    // Business logic validation
    const existing = await this.findOne({ where: { name: createDto.name } });
    if (existing) {
      throw new BadRequestException(`Feature with name '${createDto.name}' already exists`);
    }

    // Create with default values
    const feature = await this.create({
      ...createDto,
      status: FeatureStatus.PENDING,
      createdAt: new Date(),
    });

    // Post-creation logic (notifications, logging, etc.)
    await this.logFeatureCreation(feature);
    
    return feature;
  }

  async updateWithHistory(id: string, updateDto: UpdateFeatureDto): Promise<FeatureEntity> {
    const existing = await this.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Feature with ID ${id} not found`);
    }

    // Store previous state for history
    const previousState = { ...existing };

    // Update entity
    const updated = await this.update(id, updateDto);

    // Log changes
    await this.logFeatureUpdate(id, previousState, updated);

    return updated;
  }

  async findWithFilters(filters: {
    status?: FeatureStatus;
    priority?: number;
    createdAfter?: Date;
    search?: string;
  }): Promise<FeatureEntity[]> {
    const queryBuilder = this.repository.createQueryBuilder('feature');

    if (filters.status) {
      queryBuilder.andWhere('feature.status = :status', { status: filters.status });
    }

    if (filters.priority) {
      queryBuilder.andWhere('feature.priority >= :priority', { priority: filters.priority });
    }

    if (filters.createdAfter) {
      queryBuilder.andWhere('feature.createdAt >= :date', { date: filters.createdAfter });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(feature.name ILIKE :search OR feature.description ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    return queryBuilder.getMany();
  }

  private async logFeatureCreation(feature: FeatureEntity): Promise<void> {
    // Implementation for audit logging
    console.log(`Feature created: ${feature.name} (ID: ${feature.id})`);
  }

  private async logFeatureUpdate(id: string, before: any, after: FeatureEntity): Promise<void> {
    // Implementation for change history
    console.log(`Feature updated: ${id}`, { before, after });
  }
}
```

## 🛡️ AUTHENTICATION & AUTHORIZATION PATTERN

```typescript
// Custom decorator for permissions
import { SetMetadata } from '@nestjs/common';
import { Permissions } from '../enums/permissions';

export const RequirePermissions = (...permissions: Permissions[]) => 
  SetMetadata('permissions', permissions);

// Usage in controller
@Post()
@RequirePermissions(Permissions.FEATURE_CREATE)
@UseGuards(AuthGuard, RolesGuard)
async create(@Body() createDto: CreateFeatureDto): Promise<FeatureEntity> {
  return this.featureService.createFeature(createDto);
}

// Advanced auth guard usage
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PermissionsGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasPermission = requiredPermissions.some(permission => 
      user.permissions?.includes(permission)
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
```

## 🔄 ASYNC PROCESSING PATTERN

```typescript
// Worker/Queue processing pattern
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class FeatureProcessingService {
  
  @Cron(CronExpression.EVERY_10_MINUTES)
  async processPendingFeatures(): Promise<void> {
    const pendingFeatures = await this.featureService.findWithFilters({
      status: FeatureStatus.PENDING
    });

    for (const feature of pendingFeatures) {
      try {
        await this.processFeature(feature);
      } catch (error) {
        console.error(`Error processing feature ${feature.id}:`, error);
        await this.handleProcessingError(feature, error);
      }
    }
  }

  private async processFeature(feature: FeatureEntity): Promise<void> {
    // Complex business logic here
    await this.validateFeature(feature);
    await this.enrichFeatureData(feature);
    await this.updateFeatureStatus(feature, FeatureStatus.ACTIVE);
  }

  private async handleProcessingError(feature: FeatureEntity, error: any): Promise<void> {
    // Error handling and retry logic
    const retryCount = (feature.metadata?.retryCount || 0) + 1;
    
    if (retryCount > 3) {
      await this.updateFeatureStatus(feature, FeatureStatus.ARCHIVED);
    } else {
      await this.featureService.update(feature.id, {
        metadata: { ...feature.metadata, retryCount, lastError: error.message }
      });
    }
  }
}
```

## 📊 RESPONSE FORMAT PATTERN

```typescript
// Standardized API response format
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Success response helper
export const createSuccessResponse = <T>(
  data: T, 
  message?: string,
  meta?: any
): ApiResponse<T> => ({
  success: true,
  data,
  message,
  meta,
});

// Error response helper
export const createErrorResponse = (
  error: string,
  message?: string
): ApiResponse<null> => ({
  success: false,
  data: null,
  message,
  error,
});

// Usage in controller
@Get()
async findAll(
  @Query('page') page = 1,
  @Query('limit') limit = 10
): Promise<ApiResponse<FeatureEntity[]>> {
  const features = await this.featureService.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await this.featureService.count();

  return createSuccessResponse(features, 'Features retrieved successfully', {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}
```

## 🧪 TESTING PATTERN

```typescript
// Unit test template
import { Test, TestingModule } from '@nestjs/testing';
import { FeatureService } from './feature.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FeatureEntity } from './entity/feature.entity';
import { Repository } from 'typeorm';

describe('FeatureService', () => {
  let service: FeatureService;
  let repository: Repository<FeatureEntity>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureService,
        {
          provide: getRepositoryToken(FeatureEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FeatureService>(FeatureService);
    repository = module.get<Repository<FeatureEntity>>(getRepositoryToken(FeatureEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFeature', () => {
    it('should create a feature successfully', async () => {
      const createDto = { name: 'Test Feature', description: 'Test Description' };
      const savedFeature = { id: '123', ...createDto };

      mockRepository.create.mockReturnValue(savedFeature);
      mockRepository.save.mockResolvedValue(savedFeature);

      const result = await service.createFeature(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(savedFeature);
      expect(result).toEqual(savedFeature);
    });
  });
});
```

---

**Last Updated**: 2025-01-17  
**Patterns Source**: LCM Service NestJS Architecture  
**Usage**: Copy patterns and adapt for specific features/modules