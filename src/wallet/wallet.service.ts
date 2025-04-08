import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { User } from '../user/user.entity';
import { Transaction, TransactionType } from '../transaction/transaction.entity';
import { FxRateService } from '../fx-rate/fx-rate.service'; // Import FX Service for conversion
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    @InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,
    private readonly fxRateService: FxRateService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache
  ) {}

  async getWallet(user: User) {
    // Get wallet balances by currency, if no wallet exists, create it
    console.log(user)
    const walletBalances = await this.walletRepo.find({ where: { user } });

    if (walletBalances.length === 0) {
      const ngnWallet = this.walletRepo.create({ user, currency: 'NGN', balance: 0 });
      const usdWallet = this.walletRepo.create({ user, currency: 'USD', balance: 0 });
      await this.walletRepo.save([ngnWallet, usdWallet]);
      return { NGN: 0, USD: 0 }; // Default values if no wallet
    }

    return walletBalances.reduce((acc, wallet) => {
      acc[wallet.currency] = wallet.balance;
      return acc;
    }, {});
  }

  async fundWallet(user: User, currency: string, amount: number) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    
    let wallet = await this.walletRepo.findOne({ where: { user, currency } });

    console.log(amount)
    
    if (!wallet) {
      wallet = this.walletRepo.create({ user, currency, balance: 0 });
    }

    console.log(wallet)
    wallet.balance = parseFloat(wallet.balance.toString());

    wallet.balance += amount;

    console.log(wallet)
    await this.walletRepo.save(wallet);



    // Log the fund transaction
    const transaction = this.transactionRepo.create({
      user,
      type: TransactionType.FUND,
      fromCurrency: currency,
      toCurrency: currency,
      amount,
      rate: 1, // No rate required for fund
    });

    await this.transactionRepo.save(transaction);
    return wallet;
  }

  async convertCurrency(user: User, fromCurrency: string, toCurrency: string, amount: number) {
    const fxRate = await this.getFxRate(fromCurrency, toCurrency);

    const convertedAmount = amount * fxRate;

    return {
      convertedAmount,
      fxRate,
    };
  }

  async tradeCurrency(user: User, fromCurrency: string, toCurrency: string, amount: number) {
    // Check if user has enough balance
    const wallet = await this.walletRepo.findOne({ where: { user, currency: fromCurrency } });

    if (!wallet || wallet.balance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    const fxRate = await this.getFxRate(fromCurrency, toCurrency);
    const convertedAmount = amount * fxRate;

    // Deduct from the source wallet
    wallet.balance -= amount;
    await this.walletRepo.save(wallet);

    // Add to the target wallet
    let targetWallet = await this.walletRepo.findOne({ where: { user, currency: toCurrency } });

    if (!targetWallet) {
      targetWallet = this.walletRepo.create({ user, currency: toCurrency, balance: 0 });
    }

    targetWallet.balance += convertedAmount;
    await this.walletRepo.save(targetWallet);

    // Log the trade transaction
    const transaction = this.transactionRepo.create({
      user,
      type: TransactionType.TRADE,
      fromCurrency,
      toCurrency,
      amount,
      rate: fxRate,
    });

    await this.transactionRepo.save(transaction);

    return {
      message: 'Trade successful',
      fromWallet: wallet,
      toWallet: targetWallet,
    };
  }

  private async getFxRate(fromCurrency: string, toCurrency: string): Promise<number> {
    const cacheKey = `${fromCurrency}_${toCurrency}_rate`;
    const cachedRate = await this.cacheManager.get(cacheKey);

    if (cachedRate) {
      return cachedRate as number;
    }

    const fxRate = await this.fxRateService.getExchangeRate(fromCurrency, toCurrency);
    await this.cacheManager.set(cacheKey, fxRate, 7200); // Cache for 2 hours (in seconds)

    return fxRate;
  }
}
