import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from 'src/modules/product/schemas/product.schema';
import { Shop } from 'src/modules/shop/schemas/shop.schema';

export type InventoryDocument = HydratedDocument<Inventory>;

@Schema({ timestamps: true })
export class Inventory {
    @Prop({
        required: true,
        ref: Product.name,
    })
    inventory_productId: mongoose.Schema.Types.ObjectId;

    @Prop({
        required: false,
        default: 'unknown',
    })
    inventory_location: string;

    @Prop({
        required: true,
        min: 0,
    })
    inventory_stock: number;

    @Prop({
        required: true,
        ref: Shop.name,
    })
    inventory_shopId: mongoose.Schema.Types.ObjectId;

    @Prop({
        default: () => [],
    })
    inventory_reservation: {
        cartId: string;
        stock: number;
        createdOn: Date;
    }[];

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
