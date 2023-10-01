import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { EApplyDiscountFor, EDiscountType } from '../discount.constant';

export type DiscountDocument = HydratedDocument<Discount>;

@Schema({ timestamps: true })
export class Discount {
    @Prop({
        required: true,
        trim: true,
    })
    discount_name: string;

    @Prop({
        trim: true,
    })
    discount_description: string;

    @Prop({
        required: true,
        enum: EDiscountType,
        default: EDiscountType.FIXED_AMOUNT,
        lowercase: true,
        trim: true,
    })
    discount_type: string;

    @Prop({
        required: true,
    })
    discount_value: number;

    @Prop({
        required: true,
        trim: true,
        lowercase: true,
    })
    discount_code: string;

    @Prop({
        default: new Date(),
    })
    discount_start_date: Date;

    @Prop({
        default: function () {
            const futureDate = new Date(this.discount_start_date);
            futureDate.setDate(futureDate.getDate() + 7);
            return futureDate;
        },
        validate: {
            validator: function (value) {
                return value > this.discount_start_date;
            },
            message: 'end_date must be greater than start_date',
        },
    })
    discount_end_date: Date;

    @Prop({
        required: true,
    })
    discount_max_use: number;

    @Prop()
    discount_used_count: number;

    @Prop({
        default: () => [],
    })
    discount_list_used: mongoose.Schema.Types.ObjectId[];

    @Prop({
        required: true,
    })
    discount_max_use_per_user: number;

    @Prop({
        default: 0,
    })
    discount_min_price: number;

    @Prop({
        required: true,
    })
    discount_shopId: mongoose.Schema.Types.ObjectId;

    @Prop({
        default: true,
    })
    discount_active: boolean;

    @Prop({
        required: true,
        trim: true,
        lowercase: true,
        enum: EApplyDiscountFor,
    })
    discount_apply_to: string;

    @Prop({
        default: () => [],
    })
    discount_list_product: mongoose.Schema.Types.ObjectId[];

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
