import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let prisma: DatabaseService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(DatabaseService);

    await app.init();

    // Clean up the database
    await prisma.product.deleteMany();
    await prisma.customer.deleteMany();

    // Register an admin user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'admin123',
        billing_address_id: 'billing_id_123',
      })
      .expect(HttpStatus.CREATED);

    await prisma.customer.update({
      where: { email: 'john.doe@example.com' },
      data: { role: 'ADMIN' },
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'admin123',
      });
    // .expect(HttpStatus.OK);

    accessToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a product', async () => {
    const product = {
      title: 'Test Product',
      description: 'This is a test product.',
      price: 49.99,
    };

    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(product)
      .expect(HttpStatus.CREATED);

    expect(response.body.title).toEqual(product.title);
    expect(response.body.description).toEqual(product.description);
    expect(response.body.price).toEqual(product.price);
  });

  it('should get all products', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(HttpStatus.OK); // Oczekuj statusu 200 OK

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a single product by id', async () => {
    const product = await prisma.product.findFirst();

    const response = await request(app.getHttpServer())
      .get(`/products/${product.id}`)
      .expect(HttpStatus.OK); // Oczekuj statusu 200 OK

    expect(response.body.title).toEqual(product.title);
  });

  it('should update a product', async () => {
    const product = await prisma.product.findFirst();

    const updatedProduct = {
      title: 'Updated Product',
      description: 'Updated description',
      price: 59.99,
    };

    const response = await request(app.getHttpServer())
      .patch(`/products/${product.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updatedProduct)
      .expect(HttpStatus.OK); // Oczekuj statusu 200 OK

    expect(response.body.title).toEqual(updatedProduct.title);
    expect(response.body.price).toEqual(updatedProduct.price);
  });

  it('should delete a product', async () => {
    const product = await prisma.product.findFirst();

    await request(app.getHttpServer())
      .delete(`/products/${product.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK); // Oczekuj statusu 200 OK

    const deletedProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });

    expect(deletedProduct.deletedAt).toBeDefined();
  });
});
