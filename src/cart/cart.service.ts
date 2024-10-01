import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: DatabaseService) {}

  async addToCart(customerId: string, productId: string, quantity: number) {
    // Sprawdzenie, czy użytkownik istnieje
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Sprawdzenie, czy produkt istnieje
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Sprawdzenie, czy ilość nie przekracza dostępnej ilości produktu
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
      // Tworzymy nowy koszyk dla klienta
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
        // Aktualizacja ilości w koszyku
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
        // Dodanie nowego produktu do koszyka
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

  // Usuwanie produktu z koszyka
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
    if (!cartItem) throw new Error('Product not found in cart');

    // Sprawdź, czy ilość w koszyku jest większa niż ilość, którą chcemy usunąć
    if (cartItem.quantity > quantity) {
      // Zmniejsz ilość produktu w koszyku
      return this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity - quantity },
      });
    } else {
      // Jeśli ilość jest mniejsza lub równa, usuń element z koszyka
      return this.prisma.cartItem.delete({
        where: { id: cartItem.id },
      });
    }
  }

  // Wyświetlanie zawartości koszyka
  async getCart(customerId: string) {
    return this.prisma.cart.findFirst({
      where: { customer_id: customerId },
      include: { items: { include: { product: true } } },
    });
  }

  private async getCustomerEmail(customerId: string): Promise<string> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      select: { email: true },
    });
    return customer?.email || '';
  }
}
