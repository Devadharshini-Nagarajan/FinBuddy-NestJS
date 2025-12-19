import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TEMP_CATEGORY_LIMIT } from 'src/utils/constants';

@Injectable()
export class BudgetCategoryService {
  constructor(private readonly prisma: DatabaseService) {}

  async updateBudgetCategoryLimit(body: any): Promise<any> {
    const updates = body.map((item) =>
      this.prisma.budgetCategory.update({
        where: { id: item.id },
        data: {
          ...(item.limit !== undefined && { limit: item.limit }),
        },
      }),
    );

    const results = await this.prisma.$transaction(updates);
    return results;
  }

  async createBudgetCategory(body: any): Promise<any> {
    const creations = body.categoryIds.map((categoryId: string) =>
      this.prisma.budgetCategory.create({
        data: {
          budgetId: body.budgetId,
          categoryId: categoryId,
          limit: TEMP_CATEGORY_LIMIT,
        },
      }),
    );
    const results = await this.prisma.$transaction(creations);
    return results;
  }
}
