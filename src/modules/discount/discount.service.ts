import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Discount } from './schemas/discount.schema';
import { Model } from 'mongoose';
import { CreateDiscountDto } from './dtos/create-discount.dto';
import { CommonReturn } from 'src/common/helpers';
import { EReturnStatus } from 'src/common/common.constant';
import { EApplyDiscountFor } from './discount.constant';

@Injectable()
export class DiscountService {
    constructor(
        @InjectModel(Discount.name)
        private readonly discountModel: Model<Discount>,
    ) {}

    async CreateDiscount(createDiscountDto: CreateDiscountDto, shopId: string) {
        const {
            discount_name,
            discount_description,
            discount_type,
            discount_value,
            discount_code,
            discount_start_date,
            discount_end_date,
            discount_max_use,
            discount_max_use_per_user,
            discount_min_price,
            discount_active,
            discount_apply_to,
            discount_list_product,
        } = createDiscountDto;

        const discount = await this.discountModel.create({
            discount_name,
            discount_description,
            discount_type,
            discount_value,
            discount_code,
            discount_start_date,
            discount_end_date,
            discount_max_use,
            discount_max_use_per_user,
            discount_min_price,
            discount_shopId: shopId,
            discount_active,
            discount_apply_to,
            discount_list_product,
        });

        if (!discount) throw new BadRequestException('Create discount failed.');
        return CommonReturn({
            status: EReturnStatus.SUCCESS,
            statusCode: HttpStatus.CREATED,
            data: { discount },
            message: 'Create discount success.',
        });
    }
}
