import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { readFileSync } from 'fs';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('swagger.json')
  getSwaggerJson(@Res() res: Response) {
    const swaggerFile = readFileSync('./swagger.json', 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerFile);
  }
}
