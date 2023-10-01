import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { Clothing, ClothingSchema } from './schemas/clothing.schema';
import { Furniture, FurnitureSchema } from './schemas/furniture.schema';
import { Electronic, ElectronicSchema } from './schemas/electronic.schema';
import { ClothingService } from './productTypeService/clothing.service';
import { FurnitureService } from './productTypeService/furniture.service';
import { ElectronicService } from './productTypeService/electronic.service';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
            { name: Clothing.name, schema: ClothingSchema },
            { name: Furniture.name, schema: FurnitureSchema },
            { name: Electronic.name, schema: ElectronicSchema },
        ]),
        InventoryModule,
    ],
    controllers: [ProductController],
    providers: [
        ProductService,
        ClothingService,
        FurnitureService,
        ElectronicService,
    ],
})
export class ProductModule {}
