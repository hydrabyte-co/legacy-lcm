import { Entity, Column } from 'typeorm';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Base } from 'src/resources/base/entity/base.entity';
import { Status } from '../enum/product.enum';

@Entity('products')
export class Product extends Base {
  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  name = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  categoryId = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  status: Status = Status.Draft;
}
