import { Entity, Column } from 'typeorm';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { CategoryStatus } from '../enum/category.enum';
import { Controllers } from 'src/common/enums/controllers';

@Entity(Controllers.Template_Categories)
export class Category extends Base {
  // Customized fields
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
  status: CategoryStatus = CategoryStatus.Draft;

  @Column()
  @IsBoolean()
  @IsNotEmpty()
  isActive = false;
}
