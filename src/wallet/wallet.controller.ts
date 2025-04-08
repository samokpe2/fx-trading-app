import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { WalletService } from './wallet.service';
import { User } from '../user/user.entity';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import {
  FundWalletDto,
  ConvertCurrencyDto,
  TradeCurrencyDto,
} from './dto/wallet.dto';

@ApiBearerAuth('access-token')
@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getWallet(@CurrentUser() user: User) {
    return this.walletService.getWallet(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('fund')
  @ApiBody({ type: FundWalletDto })
  async fundWallet(@CurrentUser() user: User, @Body() body: FundWalletDto) {
    return this.walletService.fundWallet(user, body.currency, body.amount);
  }

  @UseGuards(JwtAuthGuard)
  @Post('convert')
  @ApiBody({ type: ConvertCurrencyDto })
  async convertCurrency(
    @CurrentUser() user: User,
    @Body() body: ConvertCurrencyDto,
  ) {
    return this.walletService.convertCurrency(
      user,
      body.fromCurrency,
      body.toCurrency,
      body.amount,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('trade')
  @ApiBody({ type: TradeCurrencyDto })
  async tradeCurrency(
    @CurrentUser() user: User,
    @Body() body: TradeCurrencyDto,
  ) {
    return this.walletService.tradeCurrency(
      user,
      body.fromCurrency,
      body.toCurrency,
      body.amount,
    );
  }
}
