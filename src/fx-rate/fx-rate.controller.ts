// src/fx/fx.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { FxRateService } from './fx-rate.service';

@Controller('fx')
export class FxRateController {
  constructor(private readonly fxRateService: FxRateService) {}

  @Get('rates')
  async getRates(
    @Query('from') from: string = 'NGN',
    @Query('to') to: string = 'USD',
  ) {
    const rate = await this.fxRateService.getExchangeRate(from, to);
    return { from, to, rate };
  }
}
