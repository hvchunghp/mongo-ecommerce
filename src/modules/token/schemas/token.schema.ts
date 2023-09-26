import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Shop } from 'src/modules/shop/schemas/shop.schema';
export type TokenDocument = HydratedDocument<Token>;

@Schema({ timestamps: true })
export class Token {
    @Prop({
        required: true,
        ref: Shop.name,
    })
    userId: mongoose.Schema.Types.ObjectId;

    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    publicKey: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    privateKey: string;

    @Prop({
        type: String,
        required: true,
    })
    accessToken: string;

    @Prop({
        type: String,
        required: true,
    })
    refreshToken: string;

    @Prop({
        type: Array,
        default: [],
    })
    refreshTokensUsed: any[];

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
