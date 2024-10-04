import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: DatabaseService) {}

  async addToCart(customerId: string, productId: string, quantity: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (quantity > product.stock) {
      throw new BadRequestException(
        'Requested quantity exceeds available stock',
      );
    }

    const cart = await this.prisma.cart.findFirst({
      where: { customer_id: customerId },
      include: { items: true },
    });

    if (!cart) {
      return this.prisma.cart.create({
        data: {
          customer_id: customerId,
          email: customer.email,
          items: {
            create: {
              productId,
              quantity,
            },
          },
        },
        include: { items: true },
      });
    } else {
      const existingCartItem = cart.items.find(
        (item) => item.productId === productId,
      );

      if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + quantity;
        if (newQuantity > product.stock) {
          throw new BadRequestException(
            'Requested quantity exceeds available stock',
          );
        }
        return this.prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: newQuantity },
        });
      } else {
        return this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
        });
      }
    }
  }

  async removeFromCart(
    customerId: string,
    productId: string,
    quantity: number,
  ) {
    const cart = await this.prisma.cart.findFirst({
      where: { customer_id: customerId },
      include: { items: true },
    });

    if (!cart) throw new Error('Cart not found');

    const cartItem = cart.items.find((item) => item.productId === productId);
    if (!cartItem) throw new NotFoundException('Product not found in cart');

    if (cartItem.quantity > quantity) {
      return this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity - quantity },
      });
    } else {
      return this.prisma.cartItem.delete({
        where: { id: cartItem.id },
      });
    }
  }

  async getCart(customerId: string): Promise<CartDto | null> {
    return this.prisma.cart.findFirst({
      where: { customer_id: customerId },
      include: { items: { include: { product: true } } },
    });
  }

  async getCartItemCount(customerId: string): Promise<number> {
    const cart = await this.prisma.cart.findFirst({
      where: { customer_id: customerId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemCount = cart.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    return itemCount;
  }
}
