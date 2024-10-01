import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: DatabaseService) {}

  async createOrder(customerId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { customer_id: customerId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    const order = await this.prisma.order.create({
      data: {
        customer_id: customerId,
        status: 'pending',
        payment_status: 'not_paid',
        shipping_address: 'Test Address',
        total_price: totalPrice,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  }

  async getOrdersForCustomer(customerId: string) {
    return this.prisma.order.findMany({
      where: { customer_id: customerId },
      include: { items: { include: { product: true } } },
    });
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: { items: { include: { product: true } } },
    });
  }

  async deleteOrder(orderId: string) {
    return this.prisma.order.delete({
      where: { id: orderId },
    });
  }
}
