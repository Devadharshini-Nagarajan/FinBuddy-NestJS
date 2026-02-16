import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { InsightsService } from 'src/services/insights.service';

@UseGuards(JwtAuthGuard)
@Controller('insights')
export class InsightsController {
  constructor(private insightsService: InsightsService) {}

  @Post()
  async getInsights(@Req() req: any, @Body() body: any): Promise<any> {
    return this.insightsService.getInsights(req, body);
  }
}
