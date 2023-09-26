import {
    BadRequestException,
    Injectable,
    NestMiddleware,
    ValidationPipe,
} from '@nestjs/common';
import { Shop } from '../schemas/shop.schema';
import { Model } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { CreateShopDto } from '../dtos/create-new-shop.dto';
import { InjectModel } from '@nestjs/mongoose';
import { newMiddlewareDto } from 'src/common/helpers';

@Injectable()
export class CheckExistedEmail implements NestMiddleware {
    constructor(
        @InjectModel(Shop.name) private readonly shopModel: Model<Shop>,
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const body = await newMiddlewareDto(CreateShopDto, req.body);

        const checkExisted = await this.shopModel.findOne({
            email: body.email,
        });

        if (checkExisted) {
            throw new BadRequestException('Email already used.');
        }

        next();
    }
}
