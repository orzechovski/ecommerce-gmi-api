import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { mockProducts, registerUser, loginUser } from './test-helpers';

describe('CartController (e2e)', () => {
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

    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.customer.deleteMany();

    const user = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      password: 'admin123',
      billing_address_id: 'billing_id_123',
    };

    const registerResponse = await registerUser(app, user);
    customerId = registerResponse.body.id;

    accessToken = await loginUser(app, user.email, user.password);
  });

  afterAll(async () => {
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.customer.deleteMany();
    await app.close();
  });

  it('should add a product to the cart', async () => {
    const product = await prisma.product.create({
      data: mockProducts[0],
    });

    const response = await request(app.getHttpServer())
      .post('/cart/add')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ customerId, productId: product.id, quantity: 2 })
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty('items');
    expect(response.body.items.length).toBeGreaterThan(0);
    expect(response.body.items[0].productId).toEqual(product.id);
    expect(response.body.items[0].quantity).toEqual(2);
  });

  it('should get the cart for a customer', async () => {
    const response = await request(app.getHttpServer())
      .get(`/cart/${customerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('items');
    expect(response.body.items.length).toBeGreaterThan(0);
  });

  it('should remove a product from the cart', async () => {
    const product = await prisma.product.create({
      data: mockProducts[1],
    });

    await request(app.getHttpServer())
      .post('/cart/add')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ customerId, productId: product.id, quantity: 2 })
      .expect(HttpStatus.CREATED);

    const removeResponse = await request(app.getHttpServer())
      .delete('/cart/remove')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ customerId, productId: product.id, quantity: 1 })
      .expect(HttpStatus.OK);

    expect(removeResponse.body).toHaveProperty('quantity');
    expect(removeResponse.body.quantity).toEqual(1);

    const cartResponse = await request(app.getHttpServer())
      .get(`/cart/${customerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    const updatedItem = cartResponse.body.items.find(
      (item) => item.productId === product.id,
    );
    expect(updatedItem.quantity).toEqual(1);

    await request(app.getHttpServer())
      .delete('/cart/remove')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ customerId, productId: product.id, quantity: 1 })
      .expect(HttpStatus.OK);

    const finalCartResponse = await request(app.getHttpServer())
      .get(`/cart/${customerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    expect(
      finalCartResponse.body.items.some(
        (item) => item.productId === product.id,
      ),
    ).toBe(false);
  });
});
