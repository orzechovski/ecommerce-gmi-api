import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { readFileSync } from 'fs';
import { Response } from 'express';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
@ApiExcludeController()
@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('swagger.json')
  getSwaggerJson(@Res() res: Response) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).send('Not found');
    }
    const swaggerFile = readFileSync('./swagger.json', 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerFile);
  }
}
