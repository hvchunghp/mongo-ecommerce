import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductAttributeDto } from '../dtos/create-new-product.dto';
import { Clothing } from '../schemas/clothing.schema';
import { UpdateProductAttributeDto } from '../dtos/update-product.dto';

@Injectable()
export class ClothingService {
    constructor(
        @InjectModel(Clothing.name)
        private readonly clothingModel: Model<Clothing>,
    ) {}
    async createProduct(
        productAttributeDto: ProductAttributeDto,
        product_shop: string,
    ) {
        const { brand, size, material } = productAttributeDto;

        const product = await this.clothingModel.create({
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
        const { brand, size, material } = updateProductAttributeDto;
        const product = await this.clothingModel
            .findOneAndUpdate(
                {
                    _id: productId,
                },
                {
                    $set: {
                        brand,
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
