import { ApiProperty } from '@nestjs/swagger';
import { JsonValue } from '@prisma/client/runtime/library';
import { IsString, IsNumber } from 'class-validator';
import { ProductDto } from 'src/products/dto/product.dto';

export class AddToCartDto {
  @ApiProperty({ description: 'ID of the customer', example: 'customer_123' })
  @IsString()
  customerId: string;

  @ApiProperty({ description: 'ID of the product', example: 'product_123' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Quantity of the product to add', example: 2 })
  @IsNumber()
  quantity: number;
}

export class RemoveFromCartDto {
  @ApiProperty({ description: 'ID of the customer', example: 'customer_123' })
  @IsString()
  customerId: string;

  @ApiProperty({ description: 'ID of the product', example: 'product_123' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Quantity of the product to remove', example: 1 })
  @IsNumber()
  quantity: number;
}

export class CartItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsString()
  @ApiProperty({
    description: 'ID of the cart item',
    example: 'cart-item-123',
  })
  cartId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: ProductDto })
  product: ProductDto;
}

export class CartDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  customer_id: string;

  @ApiProperty({
    nullable: true,
    description: 'Can be a string, number, or object (JSON)',
  })
  payment_session: JsonValue;

  @ApiProperty({ nullable: true })
  payment_id: string | null;

  @ApiProperty()
  type: string;

  @ApiProperty({ nullable: true })
  completed_at: Date | null;

  @ApiProperty({ nullable: true })
  payment_authorized_at: Date | null;

  @ApiProperty({ nullable: true })
  idempotency_key: string | null;

  @ApiProperty({ nullable: true, description: 'Can be any valid JSON value' })
  context: JsonValue;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null;

  @ApiProperty({ nullable: true, description: 'Can be any valid JSON value' })
  metadata: JsonValue;

  @ApiProperty({ type: [CartItemDto] })
  items: CartItemDto[];
}
