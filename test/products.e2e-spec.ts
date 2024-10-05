import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { mockProducts, registerUser, loginUser } from './test-helpers';

describe('ProductsController (e2e) - User Actions', () => {
  let app: INestApplication;
  let prisma: DatabaseService;
  let userAccessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(DatabaseService);

    await app.init();

    await prisma.product.deleteMany();
    await prisma.customer.deleteMany();

    await registerUser(app, {
      email: 'john.doe@example.com',
      password: 'admin123',
    });

    userAccessToken = await loginUser(app, 'john.doe@example.com', 'admin123');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not create a product', async () => {
    const product = mockProducts[0];

    await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send(product)
      .expect(HttpStatus.FORBIDDEN);
  });
});

describe('ProductsController (e2e) - Admin Actions', () => {
  let app: INestApplication;
  let prisma: DatabaseService;
  let userAdminToken: string;
  let productId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(DatabaseService);

    await app.init();

    await prisma.product.deleteMany();
    await prisma.customer.deleteMany();

    await registerUser(app, {
      email: 'john.doe@example.com',
      password: 'admin123',
      adminSecretKey: process.env.ADMIN_SECRET_KEY,
    });

    userAdminToken = await loginUser(app, 'john.doe@example.com', 'admin123');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a product', async () => {
    const product = mockProducts[0];

    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${userAdminToken}`)
      .send(product)
      .expect(HttpStatus.CREATED);

    productId = response.body.id;

    expect(response.body.title).toEqual(product.title);
    expect(response.body.price).toEqual(product.price);
    expect(response.body.stock).toEqual(product.stock);
  });

  it('should edit product', async () => {
    const product = mockProducts[0];
    const newProduct = { ...product, title: 'New Product' };

    const response = await request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .set('Authorization', `Bearer ${userAdminToken}`)
      .send(newProduct)
      .expect(HttpStatus.OK);

    expect(response.body.title).toEqual(newProduct.title);
  });

  it('should delete a product', async () => {
    await request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${userAdminToken}`)
      .expect(HttpStatus.OK);
  });
});
