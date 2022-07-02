import { Module } from '@nestjs/common';
import { FoosService } from './foos.service';
import { FoosController } from './foos.controller';
import { Foo } from './entities/foo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Foo])],
  controllers: [FoosController],
  providers: [FoosService],
})
export class FoosModule {}
