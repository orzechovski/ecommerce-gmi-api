import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
  imports: [DatabaseModule, AuthModule],
})
export class ProductsModule {}
