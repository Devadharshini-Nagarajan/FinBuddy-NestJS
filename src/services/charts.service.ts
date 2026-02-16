import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { getMonthBounds } from 'src/utils/utils';

@Injectable()
export class ChartsService {
  constructor(private readonly prisma: DatabaseService) {}

  async getMonthlyCharts(userId: string, monthKey: string) {
    if (!monthKey)
      throw new BadRequestException('monthKey is required (YYYY-MM)');
    const { start, end } = getMonthBounds(monthKey);

    const budget = await this.prisma.budget.findFirst({
      where: {
        userId: userId,
        monthKey: monthKey,
      },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });

    if (!budget)
      throw new BadRequestException('No budget found for this month');

    const spentByCategory = await this.prisma.item.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        occurredAt: { gte: start, lt: end },
      },
      _sum: { amount: true },
    });

    const spentMap = new Map<string, number>(
      spentByCategory.map((x) => [x.categoryId, Number(x._sum.amount ?? 0)]),
    );

    // Stacked Data
    const categoriesStacked = budget.categories.map((bc) => {
      const limit = bc.limit ?? 0;
      const spent = spentMap.get(bc.categoryId) || 0;

      const remaining = Math.max(limit - spent, 0);
      const over = Math.max(spent - limit, 0);

      return {
        categoryId: bc.categoryId,
        name: bc.category?.name || 'Unknown',
        limit,
        spent,
        remaining,
        over,
        isActive: !!bc.category?.isActive,
      };
    });

    // Pie data
    const income = Number(budget.income ?? 0);
    const totalSpent = categoriesStacked.reduce((sum, c) => sum + c.spent, 0);
    const remaining = income - totalSpent;

    return {
      monthKey,
      pie: {
        income,
        spent: totalSpent,
        remaining,
      },
      categoriesStacked,
    };
  }
}
