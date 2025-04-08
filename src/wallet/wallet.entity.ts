// src/wallet/wallet.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @Column()
  currency: string; // NGN, USD, EUR, GBP, etc.

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  balance: number;
}
