// src/fx/fx-rate.service.ts
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { currencies } from 'src/data/currencies';

@Injectable()
export class FxRateService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {

    const supportedCurrencies = Object.keys(currencies);
    if (!supportedCurrencies.includes(fromCurrency) || !supportedCurrencies.includes(toCurrency)) {
      throw new BadRequestException('Unsupported currency selected');
    }

    const cacheKey = `fx_rate_${fromCurrency}_${toCurrency}`;
    const cachedRate = await this.cacheManager.get<number>(cacheKey);

    if (cachedRate) {
      return cachedRate;
    }

    const url = `https://v6.exchangerate-api.com/v6/abc780dba8e9e72efbc947a4/pair/${fromCurrency}/${toCurrency}`;
    const response = await this.httpService.get(url).toPromise();

    if (response.data.result !== 'success') {
      throw new Error('Failed to fetch exchange rate');
    }

    const rate = response.data.conversion_rate;

    // Save to cache for 2 hours (7200 seconds)
    await this.cacheManager.set(cacheKey, rate,  7200);

    return rate;
  }
}
