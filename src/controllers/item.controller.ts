import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";
import { ItemService } from "src/services/item.service";

@UseGuards(JwtAuthGuard)
@Controller('items')
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

    @Get('/:monthKey')
    async getItems(@Param('monthKey') monthKey: string, @Req() req: any): Promise<any> {
        const items = await this.itemService.getItems(monthKey, req);
        return items;
    }

    @Post()
    async createItem(@Body() body: any, @Req() req: any): Promise<any> {
        const result = await this.itemService.createItem(body, req);
        return result;
    }

    @Patch()
    async updateItem(@Body() body: any, @Req() req: any): Promise<any> {
        if(!body?.id) {
            throw new Error('Item ID is required for update');
        }
        const result = await this.itemService.updateItem(body, req);
        return result;
    }

    @Delete(':id')
    async deleteItem(@Param('id') id: string, @Req() req: any): Promise<any> {
        const result = await this.itemService.deleteItem(id, req);
        return result;
    }

    @Get('dashboard/:monthKey')
    async getDashboardItems(@Param('monthKey') monthKey: string, @Req() req: any): Promise<any> {
        const items = await this.itemService.getDashboardItems(monthKey, req);
        return items;
    }
}