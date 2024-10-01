import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { CartService } from './cart/cart.service';
import { CartController } from './cart/cart.controller';

@Module({
  imports: [DatabaseModule, AuthModule, ConfigModule.forRoot(), ProductsModule],
  controllers: [AppController, CartController],
  providers: [AppService, CartService],
})
export class AppModule {}
