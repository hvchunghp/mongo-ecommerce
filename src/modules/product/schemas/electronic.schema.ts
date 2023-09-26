import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Shop } from 'src/modules/shop/schemas/shop.schema';

export type ElectronicDocument = HydratedDocument<Electronic>;

@Schema({ timestamps: true })
export class Electronic {
    @Prop({
        trim: true,
        required: true,
    })
    manufacture: string;

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

export const ElectronicSchema = SchemaFactory.createForClass(Electronic);
