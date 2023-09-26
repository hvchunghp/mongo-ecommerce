import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EStatus } from '../shop.constant';

export type ShopDocument = HydratedDocument<Shop>;

@Schema({ timestamps: true })
export class Shop {
    @Prop({
        trim: true,
        maxLength: 150,
        required: true,
    })
    name: string;

    @Prop({
        required: true,
        trim: true,
        unique: true,
    })
    email: string;

    @Prop({
        required: true,
    })
    password: string;

    @Prop({
        type: String,
        required: true,
        enum: EStatus,
        default: EStatus.INACTIVE,
    })
    status: string;

    @Prop({ default: false })
    verify: boolean;

    @Prop()
    roles: any[];

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
