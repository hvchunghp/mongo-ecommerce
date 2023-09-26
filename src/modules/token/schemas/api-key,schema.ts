import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type ApiKeyDocument = HydratedDocument<ApiKey>;

@Schema({ timestamps: true })
export class ApiKey {
    @Prop({
        required: true,
        unique: true,
    })
    key: string;

    @Prop({
        default: true,
    })
    status: boolean;

    @Prop({
        required: true,
        type: [{ type: String, enum: Object.values(['0000', '1111', '2222']) }],
    })
    permission: string[];

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);
