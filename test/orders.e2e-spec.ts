import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { mockProducts, registerUser, loginUser } from './test-helpers';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let prisma: DatabaseService;
  let accessToken: string;
  let customerId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(DatabaseService);
    await app.init();

    const user = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test.user@example.com',
      password: 'password123',
      billing_address_id: 'billing_address_123',
    };
    await registerUser(app, user);

    const customer = await prisma.customer.update({
      where: { email: user.email },
      data: { role: 'USER' },
    });
    customerId = customer.id;

    accessToken = await loginUser(app, user.email, user.password);
  });

  afterAll(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.product.deleteMany();
    await app.close();
  });

  it('should create an order from the cart', async () => {
    const product = await prisma.product.create({
      data: mockProducts[0],
    });

    await request(app.getHttpServer())
      .post('/cart/add')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ customerId, productId: product.id, quantity: 2 })
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty('status', 'pending');
    expect(response.body).toHaveProperty('total_price');
    expect(response.body.items.length).toBeGreaterThan(0);
  });

  it('should get all orders for the customer', async () => {
    const response = await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
