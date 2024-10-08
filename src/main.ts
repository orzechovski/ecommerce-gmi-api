import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:3001', 'https://ecommerce-gmi-front.vercel.app'],
    methods: 'GET, HEAD, PUT, POST, DELETE, OPTIONS, PATCH',
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('E-commerce GMI API')
    .setDescription('API documentation for the E-commerce gmi project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  if (process.env.NODE_ENV !== 'production') {
    writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  }

  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
