import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { getMonthBounds } from 'src/utils/utils';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: DatabaseService) {}

  async getItems(monthKey: string, req: any): Promise<any> {
    const { start, end } = getMonthBounds(monthKey);
    const items = await this.prisma.item.findMany({
      where: {
        userId: req.user.id,
        occurredAt: {
          gte: start, // >= first day of month 00:00:00 UTC
          lt: end, //  < first day of next month 00:00:00 UTC
        },
      },
    });
    return items;
  }

  async createItem(body: any, req: any): Promise<any> {
    const newItem = await this.prisma.item.create({
      data: {
        userId: req.user.id,
        categoryId: body.categoryId,
        occurredAt: body.occurredAt,
        merchant: body.merchant ?? '',
        name: body.name,
        note: body.note ?? '',
        amount: body.amount,
      },
    });
    return newItem;
  }

  async updateItem(body: any, req: any): Promise<any> {
    const updatedItem = await this.prisma.item.update({
      where: {
        id: body.id,
        userId: req.user.id,
      },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.occurredAt !== undefined && { occurredAt: body.occurredAt }),
        ...(body.amount !== undefined && {
          amount: body.amount,
        }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
        ...(body.merchant !== undefined && { merchant: body.merchant }),
        ...(body.note !== undefined && { note: body.note }),
      },
    });
    return updatedItem;
  }

  async deleteItem(id: string, req: any): Promise<any> {
    const deletedItem = await this.prisma.item.delete({
      where: {
        id: id,
        userId: req.user.id,
      },
    });
    return deletedItem;
  }

  async getDashboardItems(monthKey: string, req: any): Promise<any> {
    const { start, end } = getMonthBounds(monthKey);

    const items = await this.prisma.item.findMany({
      where: {
        userId: req.user.id,
        occurredAt: {
          gte: start, // >= first day of month 00:00:00 UTC
          lt: end, //  < first day of next month 00:00:00 UTC
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        occurredAt: 'desc',
      },
      take: 50,
    });
    return items;
  }
}
