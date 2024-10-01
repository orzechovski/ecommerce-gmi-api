import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard) // Koszyk dostępny tylko dla zalogowanych użytkowników
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(
    @Body('customerId') customerId: string,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.addToCart(customerId, productId, quantity);
  }

  @Delete('remove')
  removeFromCart(
    @Body('customerId') customerId: string,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.removeFromCart(customerId, productId, quantity);
  }

  @Get(':customerId')
  getCart(@Param('customerId') customerId: string) {
    return this.cartService.getCart(customerId);
  }
}
