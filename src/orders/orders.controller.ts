import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../src/auth/guards/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderDto } from './dto/order.dto';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll() {
    return this.ordersService.getAllOrders();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order from customer cart' })
  @ApiResponse({ status: 201, description: 'Order created successfully.' })
  @ApiResponse({
    status: 404,
    description: 'Cart is empty or customer not found.',
  })
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto.customerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve orders for a specific customer' })
  @ApiResponse({
    status: 200,
    description: 'Customer orders retrieved successfully.',
    type: OrderDto,
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  getOrders(@Param('id') customerId: string) {
    return this.ordersService.getOrdersForCustomer(customerId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  deleteOrder(@Param('id') orderId: string) {
    return this.ordersService.deleteOrder(orderId);
  }
}
