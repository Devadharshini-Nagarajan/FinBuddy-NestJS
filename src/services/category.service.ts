import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CategoryRequestDto } from 'src/dtos/request/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: DatabaseService) {}

  async getAllCategories(req: any) {
    const categories = await this.prisma.category.findMany({
      where: { userId: req.user.id },
    });
    return categories;
  }

  async createCategory(categoryDto: CategoryRequestDto, req: any) {
    // How to show new categories to UI?
    const category = await this.prisma.category.create({
      data: {
        userId: req.user.id,
        name: categoryDto.name,
        description: categoryDto.description,
        isActive: true,
      },
    });
    return category;
  }

  async updateCategory(categoryDto: any, req: any) {
    const existing = await this.prisma.category.findFirst({
      where: {
        id: categoryDto.id,
        userId: req.user.id,
      },
    });

    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    const updateData: any = {};
    if (categoryDto.name !== undefined) {
      updateData.name = categoryDto.name;
    }
    if (categoryDto.description !== undefined) {
      updateData.description = categoryDto.description;
    }
    if (categoryDto.isActive !== undefined) {
      updateData.isActive = categoryDto.isActive;
    }

    const category = await this.prisma.category.update({
      where: { id: categoryDto.id },
      data: updateData,
    });
    return category;
  }
}
