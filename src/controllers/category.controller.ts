import { Body, Controller, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";
import { CategoryRequestDto } from "src/dtos/request/category.dto";
import { CategoryService } from "src/services/category.service";

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}


    @Get()
    async getAllCategories(@Req() req: any): Promise<any> {
        const categories = await this.categoryService.getAllCategories(req);
        return categories;
    }

    @Post()
    async createCategory(@Body() body: CategoryRequestDto, @Req() req: any): Promise<any> {
        const result = await this.categoryService.createCategory(body, req);
        return result;
    }

    @Patch()
    async updateCategory(@Body() body: any, @Req() req: any): Promise<any> {
        if(!body?.id) {
            throw new Error('Category ID is required for update');
        }
        const result = await this.categoryService.updateCategory(body, req);
        return result;
    }
}