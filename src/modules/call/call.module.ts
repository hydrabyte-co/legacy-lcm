import { Module } from '@nestjs/common';
import { CallService } from './call.service';
import { CallController } from './call.controller';
import { Call } from './entity/call.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Call],"voice")],
  controllers: [CallController],
  providers: [CallService],
})
export class CallModule {}
