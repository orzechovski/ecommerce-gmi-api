import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const mockProducts = [
  {
    title: 'Example Product 1',
    description: 'This is an example product description.',
    price: 99.99,
    stock: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    metadata: {},
    status: 'available',
    length: 10,
    subtitle: 'Example subtitle 1',
    thumbnail: '',
    weight: 1.5,
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
    mid_code: 'MID123',
    external_id: 'external_123',
  },
  {
    title: 'Example Product 2',
    description: 'This is another example product description.',
    price: 199.99,
    stock: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    metadata: {},
    status: 'available',
    length: 15,
    subtitle: 'Example subtitle 2',
    thumbnail: '',
    weight: 2.0,
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
    mid_code: 'MID456',
    external_id: 'external_456',
  },
];

export const mockUser = {
  id: 'user_12345',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  password: 'admin123',
  role: 'ADMIN',
  billing_address_id: 'billing_id_123',
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
