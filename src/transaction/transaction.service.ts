
import { Injectable } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getTransactions(user: User, type?: string) {
    // Start with the query builder for transactions
    const queryBuilder = this.transactionRepository.createQueryBuilder('transaction');

    // Filter by user ID
    queryBuilder.where('transaction.userId = :userId', { userId: user.id });

    // If a type is provided, filter by type
    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    // Fetch transactions
    const transactions = await queryBuilder.getMany();
    return transactions;
  }
}


