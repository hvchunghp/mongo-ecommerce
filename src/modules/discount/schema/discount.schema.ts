import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { EApplyDiscountFor, EDiscountType } from '../discount.constant';

export type InventoryDocument = HydratedDocument<Inventory>;

@Schema({ timestamps: true })
export class Inventory {
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
        required: true,
        default: new Date(),
    })
    discount_start_date: Date;

    @Prop({
        required: true,
    })
    discount_end_date: Date;

    @Prop({
        required: true,
    })
    discount_max_use: number;

    @Prop({
        required: true,
    })
    discount_used_count: number;

    @Prop({
        required: true,
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

export const InventorySchema = SchemaFactory.createForClass(Inventory);
