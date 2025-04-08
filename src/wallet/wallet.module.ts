import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { Transaction } from '../transaction/transaction.entity';
import { FxRateService } from '../fx-rate/fx-rate.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Transaction]), // ✅ Register your entities here
    HttpModule,
    AuthModule
  ],
  controllers: [WalletController],
  providers: [WalletService, FxRateService],
  exports: [WalletService], // optional: if other modules need WalletService
})
export class WalletModule {}
