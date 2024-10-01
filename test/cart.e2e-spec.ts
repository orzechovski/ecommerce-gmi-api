import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';

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

    // Clean up the database
    await prisma.cartItem.deleteMany(); // Najpierw usuń elementy z koszyka
    await prisma.cart.deleteMany(); // Potem koszyki
    await prisma.product.deleteMany();
    await prisma.customer.deleteMany();

    // Register a user
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'admin123',
        billing_address_id: 'billing_id_123',
      })
      .expect(HttpStatus.CREATED);

    // Set customerId
    customerId = registerResponse.body.id;

    // Update the user's role to USER
    await prisma.customer.update({
      where: { email: 'john.doe@example.com' },
      data: { role: 'USER' },
    });

    // Log in and retrieve the access token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'admin123',
      });

    accessToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    // Clean up the database after tests
    await prisma.cartItem.deleteMany(); // Najpierw usuń elementy z koszyka
    await prisma.cart.deleteMany(); // Potem koszyki
    await prisma.product.deleteMany();
    await prisma.customer.deleteMany();
    await app.close();
  });

  it('should add a product to the cart', async () => {
    // Create a test product
    const product = await prisma.product.create({
      data: {
        title: 'Test Product',
        description: 'This is a test product.',
        price: 49.99,
      },
    });

    // Add product to cart
    const response = await request(app.getHttpServer())
      .post('/cart/add')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ customerId, productId: product.id, quantity: 2 })
      .expect(HttpStatus.CREATED);

    // Check if the response contains the correct cart data
    expect(response.body).toHaveProperty('items');
    expect(response.body.items.length).toBeGreaterThan(0);
    expect(response.body.items[0].productId).toEqual(product.id);
    expect(response.body.items[0].quantity).toEqual(2);
  });

  it('should get the cart for a customer', async () => {
    // Retrieve the cart for the customer
    const response = await request(app.getHttpServer())
      .get(`/cart/${customerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    // Check the cart's contents
    expect(response.body).toHaveProperty('items');
    expect(response.body.items.length).toBeGreaterThan(0);
  });

  it('should remove a product from the cart', async () => {
    // Create a test product
    const product = await prisma.product.create({
      data: {
        title: 'Test Product 2',
        description: 'This is another test product.',
        price: 29.99,
      },
    });

    // Add the product to the cart
    await request(app.getHttpServer())
      .post('/cart/add')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ customerId, productId: product.id, quantity: 2 })
      .expect(HttpStatus.CREATED);

    // Remove one quantity of the product from the cart
    const removeResponse = await request(app.getHttpServer())
      .delete('/cart/remove')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ customerId, productId: product.id, quantity: 1 })
      .expect(HttpStatus.OK);

    // Check if the response contains correct data for the removed item
    expect(removeResponse.body).toHaveProperty('quantity');
    expect(removeResponse.body.quantity).toEqual(1); // Should now have quantity 1

    // Fetch the cart again to verify the product is still there with updated quantity
    const cartResponse = await request(app.getHttpServer())
      .get(`/cart/${customerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    // Check if the product is still in the cart with the updated quantity
    const updatedItem = cartResponse.body.items.find(
      (item) => item.productId === product.id,
    );
    expect(updatedItem.quantity).toEqual(1);

    // Remove the product completely from the cart
    await request(app.getHttpServer())
      .delete('/cart/remove')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ customerId, productId: product.id, quantity: 1 })
      .expect(HttpStatus.OK);

    // Verify the product was removed from the cart
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
