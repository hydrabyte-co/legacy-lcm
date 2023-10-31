import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffsController } from './staff.controller';
import { Staff } from './entity/staff.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Staff])],
  controllers: [StaffsController],
  providers: [StaffService],
})
export class StaffModule {}
