import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Shop } from 'src/modules/shop/schemas/shop.schema';

export type ClothingDocument = HydratedDocument<Clothing>;

@Schema({ timestamps: true })
export class Clothing {
    @Prop({
        trim: true,
        required: true,
    })
    brand: string;

    @Prop({
        trim: true,
        required: true,
    })
    size: string;

    @Prop({
        trim: true,
    })
    material: string;

    @Prop({
        required: true,
        ref: Shop.name,
    })
    product_shop: mongoose.Schema.Types.ObjectId;

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const ClothingSchema = SchemaFactory.createForClass(Clothing);
