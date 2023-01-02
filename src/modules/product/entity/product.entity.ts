import { Entity, Column } from 'typeorm';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { ProductStatus } from '../enum/product.enum';
import { Controllers } from 'src/common/enums/controllers';

@Entity(Controllers.Template_Products)
export class Product extends Base {
  // Customized fields
  @Column()
  @IsNotEmpty()
  @Length(24)
  @MaxLength(24)
  categoryId = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  name = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  note = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  status: ProductStatus = ProductStatus.Draft;

  @Column()
  @IsBoolean()
  @IsNotEmpty()
  isActive = false;
}
