import { Body, Controller, Patch, Post } from "@nestjs/common";
import { BudgetCategoryService } from "src/services/budget-category.service";

@Controller('budget-category')
export class BudgetCategoryController {
    constructor(private readonly budgetCategoryService: BudgetCategoryService) {}

    @Patch()
    async updateBudgetCategoryLimit(@Body() body: any): Promise<any> {
        const reult = await this.budgetCategoryService.updateBudgetCategoryLimit(body);
        return reult;
    }

    @Post()
    async createBudgetCategory(@Body() body: any): Promise<any> {
        const result = await this.budgetCategoryService.createBudgetCategory(body);
        return result;
    }
}