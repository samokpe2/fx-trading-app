import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { FxRateModule } from './fx-rate/fx-rate.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true, 
      }),
    }),
    AuthModule,
    WalletModule,
    TransactionModule,
    FxRateModule,
    UserModule,
    MailModule,
    CacheModule.register({
      ttl: 60 * 60 * 2, // 2 hours TTL by default
      isGlobal: true, // So you don’t have to import in every module
    }),
  ],
})
export class AppModule {}
