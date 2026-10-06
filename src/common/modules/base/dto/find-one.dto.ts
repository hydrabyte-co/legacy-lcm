import { ObjectId } from 'typeorm';
import { Expose } from 'class-transformer';

export class FindOneResult {
  // id
  @Expose()
  id: ObjectId;

  @Expose()
  createdAt: Date;
  @Expose()
  changedAt: Date;
}
