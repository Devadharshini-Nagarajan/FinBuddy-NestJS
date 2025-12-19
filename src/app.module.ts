import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { DatabaseModule } from './database/database.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { BudgetController } from './controllers/budget.controller';
import { BudgetService } from './services/budget.service';
import { BudgetCategoryController } from './controllers/budget-category.controller';
import { BudgetCategoryService } from './services/budget-category.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DatabaseModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
    ]),
    AuthModule,
    UserModule,
  ],
  controllers: [
    AppController,
    CategoryController,
    BudgetController,
    BudgetCategoryController,
  ],
  providers: [
    AppService,
    CategoryService,
    BudgetService,
    BudgetCategoryService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
