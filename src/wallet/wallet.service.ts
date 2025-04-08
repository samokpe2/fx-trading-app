import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { User } from '../user/user.entity';
import { Transaction, TransactionType } from '../transaction/transaction.entity';
import { FxRateService } from '../fx-rate/fx-rate.service'; // Import FX Service for conversion
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Logger } from '@nestjs/common';
import { currencies } from 'src/data/currencies';

@Injectable()
export class WalletService {

private readonly logger = new Logger(WalletService.name);


  constructor(
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    @InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,
    private readonly fxRateService: FxRateService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache
  ) {}

  async getWallet(user: User) {
    // Get wallet balances by currency, if no wallet exists, create it
    console.log(user);
  
    const walletBalances = await this.walletRepo.find({ where: { user } });
  
    // If no wallets exist, create default wallets for NGN and USD
    if (walletBalances.length === 0) {
      const ngnWallet = this.walletRepo.create({ user, currency: 'NGN', balance: 0 });
      const usdWallet = this.walletRepo.create({ user, currency: 'USD', balance: 0 });
      await this.walletRepo.save([ngnWallet, usdWallet]);
      return [
        { code: 'NGN', name: 'Nigerian Naira', country: 'Nigeria', amount: 0 },
        { code: 'USD', name: 'US Dollar', country: 'United States', amount: 0 },
      ]; // Default wallets
    }
  
    // Map wallet balances to the desired structure
    return walletBalances.map(wallet => {
      const currencyInfo = currencies[wallet.currency];
      return {
        code: wallet.currency,
        name: currencyInfo?.name || 'Unknown Currency',
        country: currencyInfo?.country || 'Unknown Country',
        amount: wallet.balance,
      };
    });
  }

  async fundWallet(user: User, currency: string, amount: number) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
  
    // Check if the currency exists in the currencies array
    if (!currencies[currency]) {
      throw new BadRequestException('Currency not supported');
    }
  
    // Start a new query runner
    const queryRunner = this.walletRepo.manager.connection.createQueryRunner();
  
    // Start transaction
    await queryRunner.startTransaction();
  
    try {
      // Find the wallet or create a new one
      let wallet = await queryRunner.manager.findOne(Wallet, { where: { user, currency } });
  
      if (!wallet) {
        wallet = queryRunner.manager.create(Wallet, { user, currency, balance: 0 });
      }
  
      // Update wallet balance
      wallet.balance = parseFloat(wallet.balance.toString());
      wallet.balance += amount;
  
      // Save wallet in the transaction context
      await queryRunner.manager.save(wallet);
  
      // Log the fund transaction
      const transaction = queryRunner.manager.create(Transaction, {
        user,
        type: TransactionType.FUND,
        fromCurrency: currency,
        toCurrency: currency,
        amount,
        rate: 1, // No rate required for fund
      });
  
      // Save transaction in the transaction context
      await queryRunner.manager.save(transaction);
  
      // Commit transaction
      await queryRunner.commitTransaction();
  
      return wallet;
    } catch (error) {
      // Rollback transaction if error occurs
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner to free resources
      await queryRunner.release();
    }
  }


  async convertCurrency(user: User, fromCurrency: string, toCurrency: string, amount: number) {

    const supportedCurrencies = Object.keys(currencies);
    if (!supportedCurrencies.includes(fromCurrency) || !supportedCurrencies.includes(toCurrency)) {
      throw new BadRequestException('Unsupported currency selected');
    }

    const fxRate = await this.getFxRate(fromCurrency, toCurrency);

    const convertedAmount = amount * fxRate;

    return {
      convertedAmount,
      fxRate,
    };
  }

  async tradeCurrency(user: User, fromCurrency: string, toCurrency: string, amount: number) {
    
    const supportedCurrencies = Object.keys(currencies);
    if (!supportedCurrencies.includes(fromCurrency) || !supportedCurrencies.includes(toCurrency)) {
      throw new BadRequestException('Unsupported currency selected');
    }

    const queryRunner = this.walletRepo.manager.connection.createQueryRunner();

    // Start the transaction
    await queryRunner.startTransaction();

    try {
      // Check if user has enough balance
      const wallet = await queryRunner.manager.findOne(Wallet, { where: { user, currency: fromCurrency } });
      if (!wallet || wallet.balance < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      const fxRate = await this.getFxRate(fromCurrency, toCurrency);
      const convertedAmount = amount * fxRate;

      // Deduct from the source wallet
      wallet.balance -= amount;
      await queryRunner.manager.save(wallet);

      // Add to the target wallet
      let targetWallet = await queryRunner.manager.findOne(Wallet, { where: { user, currency: toCurrency } });

      if (!targetWallet) {
        targetWallet = queryRunner.manager.create(Wallet, { user, currency: toCurrency, balance: 0 });
      }

      targetWallet.balance = parseFloat(targetWallet.balance.toString());

      targetWallet.balance += convertedAmount;
      await queryRunner.manager.save(targetWallet);

      // Log the trade transaction
      const transaction = queryRunner.manager.create(Transaction, {
        user,
        type: TransactionType.TRADE,
        fromCurrency,
        toCurrency,
        amount,
        rate: fxRate,
      });

      await queryRunner.manager.save(transaction);

      // Commit the transaction
      await queryRunner.commitTransaction();

      // Log the successful trade
      this.logger.log(`Trade successful for user: ${user.email} from ${fromCurrency} to ${toCurrency} amount: ${amount}`);

      return {
        message: 'Trade successful',
        fromWallet: wallet,
        toWallet: targetWallet,
      };
    } catch (error) {
      // If something goes wrong, rollback the transaction
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error during trade transaction for user: ${user.email}: ${error.message}`);
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
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
