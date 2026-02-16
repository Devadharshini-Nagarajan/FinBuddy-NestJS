import { Injectable, NotFoundException } from '@nestjs/common';
import { OpenAIService } from './ai/openai.service';
import { BudgetService } from './budget.service';
import { DEFAULT_MONTH_QUESTIONS } from './ai/ai.constants';
import { ItemService } from './item.service';

@Injectable()
export class InsightsService {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly itemService: ItemService,
    private openAIService: OpenAIService,
  ) {}
  async getInsights(req: any, body: any): Promise<any> {
    const bc = await this.budgetService.getBudgetAndCategories(
      body.monthKey,
      req,
    );
    if (!bc) throw new NotFoundException('No budget found for this month');
    const snapshot = this.buildMonthInsightSnapshot(bc);
    const prompt =
      DEFAULT_MONTH_QUESTIONS[req.body.questionKey] ||
      'Provide insights based on the following data.';

    return this.openAIService.generateInsights(prompt, snapshot);
  }

  buildMonthInsightSnapshot(bc: any) {
    const income = bc.budget.income ?? 0;
    const targetSavings = bc.budget.targetSavings ?? 0;

    const categories = (bc.budgetCategories ?? []).map((x) => ({
      categoryId: x.categoryId,
      name: x.category?.name ?? 'Unknown',
      description: x.category?.description ?? null,
      isActive: !!x.category?.isActive,
      limit: x.limit ?? 0,
    }));

    const totalCategoryLimit = categories.reduce(
      (sum, c) => sum + (c.limit || 0),
      0,
    );
    const remainingAfterSavingsAndLimits =
      income - (targetSavings + totalCategoryLimit);
    const status =
      remainingAfterSavingsAndLimits === 0
        ? 'balanced'
        : remainingAfterSavingsAndLimits < 0
          ? 'over'
          : 'under';
    
    const items = this.itemService.getItems(bc.budget.monthKey, { user: { id: bc.budget.userId } });

    return {
      monthKey: bc.budget.monthKey,
      income,
      targetSavings,
      note: bc.budget.note,
      totalCategoryLimit,
      categories,
      remainingAfterSavingsAndLimits,
      status,
      items
    };
  }
}
