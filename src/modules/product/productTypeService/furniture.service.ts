import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductAttributeDto } from '../dtos/create-new-product.dto';
import { Furniture } from '../schemas/furniture.schema';
import { UpdateProductAttributeDto } from '../dtos/update-product.dto';

@Injectable()
export class FurnitureService {
    constructor(
        @InjectModel(Furniture.name)
        private readonly furnitureModel: Model<Furniture>,
    ) {}
    async createProduct(
        productAttributeDto: ProductAttributeDto,
        product_shop: string,
    ) {
        const { brand, size, material } = productAttributeDto;

        const product = await this.furnitureModel.create({
            brand,
            size,
            material,
            product_shop,
        });

        return product;
    }

    async updateProduct(
        updateProductAttributeDto: UpdateProductAttributeDto,
        productId: string,
    ) {
        const { manufacture, size, material } = updateProductAttributeDto;
        const product = await this.furnitureModel
            .findOneAndUpdate(
                {
                    _id: productId,
                },
                {
                    $set: {
                        manufacture,
                        size,
                        material,
                    },
                },
                {
                    new: true,
                },
            )
            .lean();

        return product;
    }
}
