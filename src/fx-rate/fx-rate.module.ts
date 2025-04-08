import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FxRateService } from './fx-rate.service';
import { FxRateController } from './fx-rate.controller';


@Module({
  imports: [HttpModule],
  providers: [FxRateService],
  exports: [FxRateService],
  controllers: [FxRateController],
})
export class FxRateModule {}