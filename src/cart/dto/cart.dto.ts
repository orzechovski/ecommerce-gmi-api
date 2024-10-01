import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

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
