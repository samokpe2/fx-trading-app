import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { User } from '../user/user.entity';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter transactions by type',
  })
  async getTransactions(
    @CurrentUser() user: User, // Get the user from JWT
    @Query('type') type: string | undefined, // Optional type filter
  ) {
    return this.transactionService.getTransactions(user, type);
  }
}
