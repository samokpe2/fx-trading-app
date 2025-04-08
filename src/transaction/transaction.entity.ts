// src/transaction/transaction.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/user/user.entity';

export enum TransactionType {
  FUND = 'FUND',
  CONVERT = 'CONVERT',
  TRADE = 'TRADE',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column()
  fromCurrency: string;

  @Column()
  toCurrency: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 18, scale: 6 })
  rate: number;

  @Column({ default: 'SUCCESS' })
  status: string;

  @CreateDateColumn()
  timestamp: Date;
}
