import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate } from 'class-validator';
import { CartItemDto } from 'src/cart/dto/cart.dto';

export class OrderDto {
  @ApiProperty({
    description: 'Unique identifier for the order',
    example: 'cm1uje1uj0007k0mgpe1bogcg',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Current status of the order',
    example: 'pending',
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'ID of the customer who placed the order',
    example: 'cm1tky5ax0000ntuqy6b1exsm',
  })
  @IsString()
  customer_id: string;

  @ApiProperty({
    description: 'Current payment status of the order',
    example: 'not_paid',
  })
  @IsString()
  payment_status: string;

  @ApiProperty({
    description: 'Shipping address for the order',
    example: 'Test Address',
  })
  @IsString()
  shipping_address: string;

  @ApiProperty({
    description: 'Total price of the order',
    example: 4519.95,
  })
  @IsNumber()
  total_price: number;

  @ApiProperty({
    description: 'Date when the order was created',
    example: '2024-10-04T09:42:26.011Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the order was last updated',
    example: '2024-10-04T09:42:26.011Z',
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    description: 'List of items included in the order',
    type: [CartItemDto],
  })
  items: CartItemDto[];
}
