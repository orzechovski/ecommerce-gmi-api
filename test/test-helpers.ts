import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const mockProducts = [
  {
    title: 'Example Product 1',
    description: 'This is an example product description.',
    price: 99.99,
    stock: 50,
    status: 'available',
    weight: 1.5,
    length: 10,
    width: 5,
    height: 3,
    origin_country: 'US',
    material: 'Plastic',
    hs_code: '123456',
    type_id: 'type_123',
    collection_id: 'collection_123',
    is_giftcard: false,
    discountable: true,
    profile_id: 'profile_123',
  },
  {
    title: 'Example Product 2',
    description: 'This is another example product description.',
    price: 199.99,
    stock: 30,
    status: 'available',
    weight: 2.0,
    length: 15,
    width: 6,
    height: 4,
    origin_country: 'US',
    material: 'Metal',
    hs_code: '789012',
    type_id: 'type_456',
    collection_id: 'collection_456',
    is_giftcard: false,
    discountable: true,
    profile_id: 'profile_456',
  },
];

export const mockUser = {
  email: 'john.doe@example.com',
  password: 'admin123',
  role: 'USER',
};

export const mockAdmin = {
  email: 'john.doe@example.com',
  password: 'admin123',
  role: 'ADMIN',
};

export const registerUser = async (app: INestApplication, user: any) => {
  return await request(app.getHttpServer())
    .post('/auth/register')
    .send(user)
    .expect(HttpStatus.CREATED);
};

export const loginUser = async (
  app: INestApplication,
  email: string,
  password: string,
) => {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password });

  return response.body.access_token;
};
