import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { CartService } from './cart/cart.service';
import { CartController } from './cart/cart.controller';
import { OrdersService } from './orders/orders.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ConfigModule.forRoot(),
    ProductsModule,
    OrdersModule,
  ],
  controllers: [AppController, CartController, OrdersController],
  providers: [AppService, CartService, OrdersService],
})
export class AppModule {}
