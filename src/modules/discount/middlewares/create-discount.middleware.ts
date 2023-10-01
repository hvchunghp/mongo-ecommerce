import {
    BadRequestException,
    Injectable,
    NestMiddleware,
} from '@nestjs/common';
import { newMiddlewareDto } from 'src/common/helpers';
import { NextFunction, Request, Response } from 'express';
import { CreateDiscountDto } from '../dtos/create-discount.dto';
import { EApplyDiscountFor } from '../discount.constant';
import { ProductService } from 'src/modules/product/product.service';

@Injectable()
export class CheckCreateDiscount implements NestMiddleware {
    constructor(private readonly productService: ProductService) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const body = await newMiddlewareDto(CreateDiscountDto, req.body);
        const {
            discount_start_date,
            discount_end_date,
            discount_max_use,
            discount_max_use_per_user,
            discount_apply_to,
            discount_list_product,
        } = body;
        if (discount_end_date && !discount_start_date)
            throw new BadRequestException(
                'Must pass parameter discount_end_date if you want to pass parameter discount_start_date',
            );
        if (
            discount_apply_to === EApplyDiscountFor.ALL &&
            discount_list_product?.length
        )
            throw new BadRequestException(
                'discount_list_product is not passed with discount_apply_to all',
            );

        if (discount_start_date >= discount_end_date)
            throw new BadRequestException(
                'discount_start_date must be less than discount_end_date.',
            );

        if (discount_max_use_per_user > discount_max_use)
            throw new BadRequestException(
                'discount_max_use_per_user must be less than discount_max_use.',
            );

        if (discount_apply_to === EApplyDiscountFor.SPECIFIC) {
            const products = await this.productService.getListProduct(
                req.headers['x-client-id'].toString(),
                discount_list_product,
            );
            if (products.length !== discount_list_product.length)
                throw new BadRequestException(
                    'There is a product that does not exist in discount_list_product.',
                );
        }
        next();
    }
}
