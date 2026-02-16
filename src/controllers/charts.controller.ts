import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { ChartsService } from 'src/services/charts.service';

@UseGuards(JwtAuthGuard)
@Controller('charts')
export class ChartsController {
  constructor(private readonly chartsService: ChartsService) {}

  @Get('monthly')
  getMonthlyCharts(
    @Req() req: any,
    @Query('monthKey') monthKey: string,
  ) {
    return this.chartsService.getMonthlyCharts(req.user.id, monthKey);
  }
}
