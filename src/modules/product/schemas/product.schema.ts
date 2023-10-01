import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Shop } from 'src/modules/shop/schemas/shop.schema';
import { EProductType } from '../product.constant';
import slugify from 'slugify';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
    @Prop({
        trim: true,
        required: true,
    })
    product_name: string;

    @Prop({
        trim: true,
        required: true,
    })
    product_thumb: string;

    @Prop({
        trim: true,
        required: false,
    })
    product_description: string;

    @Prop()
    product_slug: string;

    @Prop({
        required: true,
    })
    product_price: number;

    @Prop({
        required: true,
    })
    product_quantity: number;

    @Prop({
        required: true,
        enum: EProductType,
    })
    product_type: string;

    @Prop({
        required: true,
        ref: Shop.name,
    })
    product_shop: mongoose.Schema.Types.ObjectId;

    @Prop({
        required: true,
    })
    product_attributes: mongoose.Schema.Types.Mixed;

    @Prop({
        min: [0, 'Rating must be greater than 0'],
        max: [5, 'Rating must be smaller than 5'],
        set: (val) => Math.round(val * 10) / 10,
        default: 5,
    })
    rating_average: number;

    @Prop({
        default: [],
    })
    product_variation: string[];

    @Prop({
        default: true,
        index: true,
        select: false,
    })
    isDraft: boolean;

    @Prop({
        default: false,
        index: true,
        select: false,
    })
    isPublish: boolean;

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});
