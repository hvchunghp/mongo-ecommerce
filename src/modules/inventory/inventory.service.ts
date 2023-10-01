import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory } from './schemas/inventory.schema';

@Injectable()
export class InventoryService {
    constructor(
        @InjectModel(Inventory.name)
        private readonly inventoryModel: Model<Inventory>,
    ) {}

    async createInventory({
        productId,
        shopId,
        stock,
        location = 'unknown',
    }: {
        productId?: string;
        shopId?: string;
        stock?: number;
        location?: string;
    }) {
        const inventory = await this.inventoryModel.create({
            inventory_productId: productId,
            inventory_shopId: shopId,
            inventory_stock: stock,
            inventory_location: location,
        });
        if (!inventory)
            throw new BadRequestException('Create inventory failed.');
        return inventory;
    }
}
