import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import mongoose from 'mongoose';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/get-connect')
  getConnect(): number {
    return mongoose.connections.length;
  }
}
