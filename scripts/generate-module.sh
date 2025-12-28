#!/bin/bash

# Module Generator Script for LCM Service
# Usage: ./scripts/generate-module.sh <module-name>

set -e

MODULE_NAME=$1
if [ -z "$MODULE_NAME" ]; then
    echo "Usage: $0 <module-name>"
    echo "Example: $0 collection-agency"
    exit 1
fi

# Convert to different naming conventions
KEBAB_CASE=$MODULE_NAME
PASCAL_CASE=$(echo $MODULE_NAME | sed -r 's/(^|-)([a-z])/\U\2/g')
CAMEL_CASE=$(echo $MODULE_NAME | sed -r 's/(^|-)([a-z])/\L\2/g' | sed 's/^./\U&/')
SNAKE_CASE=$(echo $MODULE_NAME | tr '-' '_')

MODULE_DIR="src/modules/$KEBAB_CASE"
echo "Creating module: $MODULE_NAME"
echo "Directory: $MODULE_DIR"

# Create module directory structure
mkdir -p "$MODULE_DIR/dto"
mkdir -p "$MODULE_DIR/entity"
mkdir -p "$MODULE_DIR/enum"

# Generate controller
cat > "$MODULE_DIR/$KEBAB_CASE.controller.ts" << EOF
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ${PASCAL_CASE}Service } from './${KEBAB_CASE}.service';
import { Create${PASCAL_CASE}Data } from './dto/create.dto';
import { Update${PASCAL_CASE}Data } from './dto/update-one.dto';

@Controller('$SNAKE_CASE')
export class ${PASCAL_CASE}Controller {
  constructor(private readonly ${CAMEL_CASE}Service: ${PASCAL_CASE}Service) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createData: Create${PASCAL_CASE}Data) {
    return await this.${CAMEL_CASE}Service.create(createData);
  }

  @Get()
  async findAll() {
    return await this.${CAMEL_CASE}Service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.${CAMEL_CASE}Service.findById(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updateData: Update${PASCAL_CASE}Data,
  ) {
    return await this.${CAMEL_CASE}Service.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.${CAMEL_CASE}Service.delete(id);
  }
}
EOF

# Generate service
cat > "$MODULE_DIR/$KEBAB_CASE.service.ts" << EOF
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ${PASCAL_CASE} } from './entity/${KEBAB_CASE}.entity';
import { BaseService } from '../../common/modules/base/base.service';
import { DataHandler } from '../../common/modules/base/entity/data.class';

@Injectable()
export class ${PASCAL_CASE}Service extends BaseService<${PASCAL_CASE}> {
  constructor(
    @InjectRepository(${PASCAL_CASE})
    private readonly ${CAMEL_CASE}Repository: MongoRepository<${PASCAL_CASE}>,
  ) {
    super(${CAMEL_CASE}Repository);
  }

  // Add business-specific methods here
  async findByCode(code: string, handler: DataHandler): Promise<any> {
    return super.findOneByField('code', code, handler);
  }
}
EOF

# Generate module
cat > "$MODULE_DIR/$KEBAB_CASE.module.ts" << EOF
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${PASCAL_CASE}Controller } from './${KEBAB_CASE}.controller';
import { ${PASCAL_CASE}Service } from './${KEBAB_CASE}.service';
import { ${PASCAL_CASE} } from './entity/${KEBAB_CASE}.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([${PASCAL_CASE}]),
  ],
  controllers: [${PASCAL_CASE}Controller],
  providers: [${PASCAL_CASE}Service],
  exports: [${PASCAL_CASE}Service],
})
export class ${PASCAL_CASE}Module {}
EOF

# Generate create DTO
cat > "$MODULE_DIR/dto/create.dto.ts" << EOF
import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { ${PASCAL_CASE}Status } from '../enum/${KEBAB_CASE}.enum';

export class Create${PASCAL_CASE}Data extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  code = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name = '';

  @IsString()
  @MaxLength(255)
  description = '';

  @IsEnum(${PASCAL_CASE}Status)
  status = ${PASCAL_CASE}Status.Active;

  @IsString()
  @MaxLength(500)
  notes = '';
}

@Exclude()
export class Create${PASCAL_CASE}Result extends BaseCreateResult {
  @Expose()
  code = '';

  @Expose()
  name = '';

  @Expose()
  description = '';

  @Expose()
  status = '';

  @Expose()
  notes = '';
}
EOF

# Generate update DTO
cat > "$MODULE_DIR/dto/update-one.dto.ts" << EOF
import { IsOptional, IsString, MaxLength, IsEnum } from 'class-validator';
import { UpdateData as BaseUpdateData } from '../../../common/modules/base/dto/update-one.dto';
import { ${PASCAL_CASE}Status } from '../enum/${KEBAB_CASE}.enum';

export class Update${PASCAL_CASE}Data extends BaseUpdateData {
  @IsOptional()
  @IsString()
  @MaxLength(24)
  code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsEnum(${PASCAL_CASE}Status)
  status?: ${PASCAL_CASE}Status;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
EOF

# Generate find-one DTO
cat > "$MODULE_DIR/dto/find-one.dto.ts" << EOF
import { Exclude, Expose } from 'class-transformer';
import { FindOneResult as BaseFindByIdResult } from '../../../common/modules/base/dto/find-one.dto';

@Exclude()
export class Find${PASCAL_CASE}ByIdResult extends BaseFindByIdResult {
  @Expose()
  code = '';

  @Expose()
  name = '';

  @Expose()
  description = '';

  @Expose()
  status = '';

  @Expose()
  notes = '';

  // Add calculated fields here
  @Expose()
  createdDate = new Date();

  @Expose()
  lastModified = new Date();
}
EOF

# Generate entity
cat > "$MODULE_DIR/entity/$KEBAB_CASE.entity.ts" << EOF
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ObjectIdColumn, Index } from 'typeorm';
import { ${PASCAL_CASE}Status } from '../enum/${KEBAB_CASE}.enum';

@Entity('${SNAKE_CASE}s')
export class ${PASCAL_CASE} {
  @ObjectIdColumn()
  id: string;

  @Column()
  @Index({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: ${PASCAL_CASE}Status, default: ${PASCAL_CASE}Status.Active })
  @Index()
  status: ${PASCAL_CASE}Status;

  @Column()
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  createdBy: string;

  @Column()
  updatedBy: string;
}
EOF

# Generate enum
cat > "$MODULE_DIR/enum/$KEBAB_CASE.enum.ts" << EOF
export enum ${PASCAL_CASE}Status {
  Active = 'active',
  Inactive = 'inactive',
  Suspended = 'suspended',
  Deleted = 'deleted',
}

export enum ${PASCAL_CASE}Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}

// Add more enums specific to $MODULE_NAME here
EOF

# Generate README
cat > "$MODULE_DIR/README.md" << EOF
# ${PASCAL_CASE} Module

**Business Purpose:** [Describe the business purpose of this module]

---

## 📋 Overview

${PASCAL_CASE} module handles [describe main functionality] within the LCM debt collection system.

### Business Context
- **Primary Function:** [Main business function]
- **Integration:** [How it integrates with other modules]
- **Data Source:** [Where data comes from]
- **Usage:** [How it's used in debt collection workflow]

### Key Features
- ✅ **Standardized DTOs:** Complete create/update/find-one DTO structure
- ✅ **Business Logic:** Domain-specific business rules
- ✅ **Integration Ready:** Compatible with other LCM modules
- ✅ **Test Support:** MockDataGenerator compatibility

---

## 🏗 Technical Architecture

### Module Structure
\`\`\`
src/modules/$KEBAB_CASE/
├── $KEBAB_CASE.controller.ts    # REST API endpoints
├── $KEBAB_CASE.service.ts       # Business logic
├── $KEBAB_CASE.module.ts        # NestJS module configuration
├── dto/
│   ├── create.dto.ts            # Creation validation ✅
│   ├── update-one.dto.ts        # Update validation ✅
│   └── find-one.dto.ts          # Response format ✅
├── entity/
│   └── $KEBAB_CASE.entity.ts    # MongoDB schema
└── enum/
    └── $KEBAB_CASE.enum.ts      # Business enums
\`\`\`

### Database Integration
- **Primary:** MongoDB (default connection)
- **Collection:** \`${SNAKE_CASE}s\`
- **Indexes:** \`code\` (unique), \`status\`

---

## 🛠 API Endpoints

### Core CRUD Operations
\`\`\`typescript
GET    /${SNAKE_CASE}              # List all ${SNAKE_CASE}s
GET    /${SNAKE_CASE}/:id          # Get ${SNAKE_CASE} by ID
POST   /${SNAKE_CASE}              # Create new ${SNAKE_CASE}
PUT    /${SNAKE_CASE}/:id          # Update ${SNAKE_CASE}
DELETE /${SNAKE_CASE}/:id          # Delete ${SNAKE_CASE}
\`\`\`

### Business Operations
\`\`\`typescript
GET    /${SNAKE_CASE}/by-code/:code    # Find by business code
// Add more business-specific endpoints here
\`\`\`

---

## 🔄 Integration Points

### LCM Module Dependencies
- [List related modules and their relationships]

---

## 🧪 Testing

### Test Data Generation
\`\`\`typescript
import { MockDataGenerator } from '../../test-utils';

const test${PASCAL_CASE} = MockDataGenerator.generate${PASCAL_CASE}({
  code: 'TEST_${MODULE_NAME}_001',
  name: 'Test ${PASCAL_CASE}',
  status: ${PASCAL_CASE}Status.Active
});
\`\`\`

---

## 📝 Development Notes

### Recent Updates
- ✅ **$(date +%Y-%m-%d):** Module created với standardized structure
- ✅ **$(date +%Y-%m-%d):** Complete DTO structure implemented
- ✅ **$(date +%Y-%m-%d):** Basic CRUD operations available

### Agent Development Tips
- Use MockDataGenerator.generate${PASCAL_CASE}() for testing
- Follow standardized DTO patterns
- Implement proper business validation rules
- Add appropriate database indexes

---

*${PASCAL_CASE} Module Documentation - LCM Service*  
*Last Updated: $(date +%Y-%m-%d)*
EOF

echo "✅ Module '$MODULE_NAME' generated successfully!"
echo "📁 Location: $MODULE_DIR"
echo ""
echo "🔧 Next steps:"
echo "1. Update the README.md với specific business requirements"
echo "2. Add the module to src/app.module.ts imports"
echo "3. Add MockDataGenerator.generate${PASCAL_CASE}() method"
echo "4. Implement business-specific logic in service"
echo "5. Add business-specific API endpoints"
echo "6. Write unit tests"
echo ""
echo "📋 Files created:"
find "$MODULE_DIR" -type f | sort
EOF