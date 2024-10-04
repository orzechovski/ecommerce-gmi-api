import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { mockProducts, registerUser, loginUser } from './test-helpers';

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

    await prisma.product.deleteMany();
    await prisma.customer.deleteMany();

    await registerUser(app, {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      password: 'admin123',
    });

    accessToken = await loginUser(app, 'john.doe@example.com', 'admin123');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a product', async () => {
    const product = mockProducts[0];

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
      .expect(HttpStatus.OK);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
