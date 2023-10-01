import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductAttributeDto } from '../dtos/create-new-product.dto';
import { Electronic } from '../schemas/electronic.schema';
import { UpdateProductAttributeDto } from '../dtos/update-product.dto';

@Injectable()
export class ElectronicService {
    constructor(
        @InjectModel(Electronic.name)
        private readonly electronicModel: Model<Electronic>,
    ) {}
    async createProduct(
        productAttributeDto: ProductAttributeDto,
        product_shop: string,
    ) {
        const { manufacture, size, material } = productAttributeDto;

        const product = await this.electronicModel.create({
            manufacture,
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
        const product = await this.electronicModel
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
