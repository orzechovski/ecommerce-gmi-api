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
import { AddToCartDto, RemoveFromCartDto } from './dto/cart.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiOperation({ summary: 'Add product to cart' })
  @ApiResponse({
    status: 201,
    description: 'Product added to cart successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or quantity exceeds available stock.',
  })
  @ApiResponse({ status: 404, description: 'Customer or product not found.' })
  addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(
      addToCartDto.customerId,
      addToCartDto.productId,
      addToCartDto.quantity,
    );
  }

  @Delete('remove')
  @ApiOperation({ summary: 'Remove product from cart' })
  @ApiResponse({
    status: 200,
    description: 'Product removed from cart successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Customer or product not found.' })
  removeFromCart(@Body() removeFromCartDto: RemoveFromCartDto) {
    return this.cartService.removeFromCart(
      removeFromCartDto.customerId,
      removeFromCartDto.productId,
      removeFromCartDto.quantity,
    );
  }

  @Get(':customerId')
  @ApiOperation({ summary: 'Get cart for customer' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  getCart(@Param('customerId') customerId: string) {
    return this.cartService.getCart(customerId);
  }
}
