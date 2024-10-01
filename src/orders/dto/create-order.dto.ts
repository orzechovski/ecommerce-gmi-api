import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'ID of the customer', example: 'customer_123' })
  @IsString()
  customerId: string;
}
