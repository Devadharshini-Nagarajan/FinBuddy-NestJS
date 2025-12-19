import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: DatabaseService) {}

  async getItems(monthKey: string, req: any): Promise<any> {
    const { start, end } = this.getMonthBounds(monthKey);

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
        amount: body.amountCents,
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
        ...(body.amountCents !== undefined && {
          amountCents: body.amountCents,
        }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
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
    const { start, end } = this.getMonthBounds(monthKey);

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

  getMonthBounds(monthKey: string) {
    const [y, m] = monthKey.split('-').map(Number);
    if (!y || !m || m < 1 || m > 12) throw new Error('Invalid monthKey');

    // Use UTC to avoid timezone drift
    const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
    const end = new Date(
      Date.UTC(m === 12 ? y + 1 : y, m === 12 ? 0 : m, 1, 0, 0, 0, 0),
    );
    return { start, end };
  }
}
