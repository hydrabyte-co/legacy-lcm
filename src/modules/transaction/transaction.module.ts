import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionsController } from './transaction.controller';
import { Transaction } from './entity/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionsController],
  providers: [TransactionService],
})
export class TransactionModule {}
