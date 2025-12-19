import { Body, Controller, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";
import { BudgetService } from "src/services/budget.service";

@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetController {
    constructor(private readonly budgetService: BudgetService) {}
    

    @Get('/categoryLimits/:monthKey')
    async getBudgetAndCategories(@Param('monthKey') monthKey: string, @Req() req: any): Promise<any> {
        const budgets = await this.budgetService.getBudgetAndCategories(monthKey, req);
        return budgets;
    }

    @Patch()
    async updateBudget(@Body() body: any, @Req() req: any): Promise<any> {
        if(!body?.id) {
            throw new Error('Budget ID is required for update');
        }
        const result = await this.budgetService.updateBudget(body, req);
        return result;
    }
    
}