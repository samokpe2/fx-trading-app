import { ApiProperty } from '@nestjs/swagger';

export class FundWalletDto {
  @ApiProperty({ example: 'USD', description: 'The currency to fund the wallet with (e.g., USD, NGN)' })
  currency: string;

  @ApiProperty({ example: 500, description: 'The amount to fund' })
  amount: number;
}

export class ConvertCurrencyDto {
  @ApiProperty({ example: 'NGN', description: 'Currency to convert from' })
  fromCurrency: string;

  @ApiProperty({ example: 'USD', description: 'Currency to convert to' })
  toCurrency: string;

  @ApiProperty({ example: 1000, description: 'Amount to convert' })
  amount: number;
}

export class TradeCurrencyDto {
  @ApiProperty({ example: 'USD', description: 'Currency to trade from' })
  fromCurrency: string;

  @ApiProperty({ example: 'NGN', description: 'Currency to trade to' })
  toCurrency: string;

  @ApiProperty({ example: 500, description: 'Amount to trade' })
  amount: number;
}
