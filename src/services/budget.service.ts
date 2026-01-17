import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  TEMP_CATEGORY_LIMIT,
  TEMP_INCOME,
  TEMP_TARGET_SAVINGS,
} from 'src/utils/constants';

@Injectable()
export class BudgetService {
  constructor(private readonly prisma: DatabaseService) {}

  async getBudgetAndCategories(monthKey: string, req: any): Promise<any> {
    const existing = await this.prisma.budget.findFirst({
      where: {
        monthKey: monthKey,
        userId: req.user.id,
      },
    });
    if (!existing) {
      console.log('Creating new budget for monthKey:', monthKey);
      const budgetAndCategories = await this.createBudgetAndWithCategories(
        monthKey,
        req,
      );
      return budgetAndCategories;
    } else {
      const budgetCategories = await this.prisma.budgetCategory.findMany({
        where: { budgetId: existing.id },
        include: {
          category: true,
        },
      });
      return {
        budget: existing,
        budgetCategories: budgetCategories,
      };
    }
  }

  async updateBudget(body: any, req: any): Promise<any> {
    const existing = await this.prisma.budget.findFirst({
      where: {
        id: body.id,
        userId: req.user.id,
      },
    });

    if (!existing) {
      throw new NotFoundException('Budget not found');
    }

    const updateData: any = {};
    if (body.income !== undefined) {
      updateData.income = body.income;
    }
    if (body.targetSavings !== undefined) {
      updateData.targetSavings = body.targetSavings;
    }
    if (body.note !== undefined) {
      updateData.note = body.note;
    }
    const budget = await this.prisma.budget.update({
      where: { id: body.id },
      data: updateData,
    });
    return budget;
  }

  /**
   * Creates budget and budgetCategories.
   * If previous month exists, clones its budgetCategories; else seeds all active categories.
   */
  async createBudgetAndWithCategories(
    monthKey: string,
    req: any,
  ): Promise<any> {
    return this.prisma.$transaction(async (tx) => {
      const prevMonthKey = this.getPrevMonthKey(monthKey);

      // create budget based on prev month if exists
      const prevBudget = await tx.budget.findFirst({
        where: {
          monthKey: prevMonthKey,
          userId: req.user.id,
        },
      });
      const budget = await tx.budget.create({
        data: {
          userId: req.user.id,
          monthKey: monthKey,
          income: prevBudget?.income ?? TEMP_INCOME,
          targetSavings: prevBudget?.targetSavings ?? TEMP_TARGET_SAVINGS,
        },
      });

      // create budgetcategories based on prev month if exists
      const prevMonthBudgetCategories = await tx.budgetCategory.findMany({
        where: {
          budgetId: prevBudget?.id,
        },
        select: { categoryId: true, limit: true },
      });
      let budgetCategoriesData: any = [];
      const activeCategories = await tx.category.findMany({
        where: { userId: req.user.id, isActive: true },
      });
      const activeCategoriesIds = activeCategories.map((cat) => cat.id);
      if (prevMonthBudgetCategories && prevMonthBudgetCategories.length > 0) {
        // clone only active categories from prev month
        budgetCategoriesData = prevMonthBudgetCategories
          .filter((cat) => activeCategoriesIds.includes(cat.categoryId))
          .map((cat) => {
            return {
              budgetId: budget.id,
              categoryId: cat.categoryId,
              limit: cat.limit,
            };
          });
        // add any new active categories not in prev month with default limit
        const remainingActiveCategories = activeCategories
          .filter(
            (cat) =>
              cat.isActive &&
              !budgetCategoriesData.some((bc: any) => bc.categoryId === cat.id),
          )
          .map((cat) => ({
            budgetId: budget.id,
            categoryId: cat.id,
            limit: TEMP_CATEGORY_LIMIT,
          }));
        budgetCategoriesData.push(...remainingActiveCategories);
      } else {
        // seed all active categories with default limit
        budgetCategoriesData = activeCategories.map((cat) => ({
          budgetId: budget.id,
          categoryId: cat.id,
          limit: TEMP_CATEGORY_LIMIT,
        }));
      }

      await tx.budgetCategory.createMany({
        data: budgetCategoriesData,
      });

      const createdBudgetCategories = await tx.budgetCategory.findMany({
        where: { budgetId: budget.id },
      });

      return {
        budget: budget,
        budgetCategories: createdBudgetCategories,
      };
    });
  }

  getPrevMonthKey(key: string): string {
    const [year, month] = key.split('-').map(Number);

    let prevYear = year - 1;
    let prevMonth = month - 1;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear--;
    }

    return `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
  }
}
