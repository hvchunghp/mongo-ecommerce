import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import mongoose, { Model } from 'mongoose';
import { Electronic } from './schemas/electronic.schema';
import { Clothing } from './schemas/clothing.schema';
import { Furniture } from './schemas/furniture.schema';
import {
    CreateNewProductDto,
    ProductAttributeDto,
} from './dtos/create-new-product.dto';
import { CommonReturn, paginating } from 'src/common/helpers';
import { EReturnStatus } from 'src/common/common.constant';
import { EProductType } from './product.constant';
import { LimitPageDto } from 'src/common/dto/limit-page';
import { GetAllPublishProductDto } from './dtos/get-all-publish-product.dto';
import { FindProductDto } from './dtos/find-product.dto';
import { FindAllProductDto } from './dtos/find-all-product.dto';

@Injectable()
export class ProductService {
    private productRegistry = {};

    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<Product>,
        @InjectModel(Electronic.name)
        private readonly electronicModel: Model<Electronic>,
        @InjectModel(Clothing.name)
        private readonly clothingModel: Model<Clothing>,
        @InjectModel(Furniture.name)
        private readonly furnitureModel: Model<Furniture>,
    ) {
        this.registerType(
            EProductType.CLOTHING,
            this.createClothing.bind(this),
        );
        this.registerType(
            EProductType.ELECTRONIC,
            this.createElectronic.bind(this),
        );
        this.registerType(
            EProductType.FURNITURE,
            this.createFurniture.bind(this),
        );
    }

    private async registerType(type, productRef) {
        this.productRegistry[type] = productRef;
    }

    private async createProductAttribute(
        product_type: string,
        productAttributeDto: ProductAttributeDto,
        product_shop: string,
    ) {
        const productRef = this.productRegistry[product_type];

        if (!productRef) {
            throw new BadRequestException('Invalid product type.');
        }

        return await productRef(productAttributeDto, product_shop);
    }

    private async createClothing(
        productAttributeDto: ProductAttributeDto,
        product_shop: string,
    ) {
        const { brand, size, material } = productAttributeDto;

        const clothing = await this.clothingModel.create({
            brand,
            size,
            material,
            product_shop,
        });

        return clothing;
    }

    private async createElectronic(
        productAttributeDto: ProductAttributeDto,
        product_shop: string,
    ) {
        const { manufacture, size, material } = productAttributeDto;

        const electronic = await this.electronicModel.create({
            manufacture,
            size,
            material,
            product_shop,
        });

        return electronic;
    }

    private async createFurniture(
        productAttributeDto: ProductAttributeDto,
        product_shop: string,
    ) {
        const { brand, size, material } = productAttributeDto;

        const furniture = await this.furnitureModel.create({
            brand,
            size,
            material,
            product_shop,
        });

        return furniture;
    }

    async handleCreateProduct(
        createNewProductDto: CreateNewProductDto,
        userId: string,
    ) {
        const {
            product_attributes,
            product_type,
            product_description,
            product_name,
            product_price,
            product_quantity,
            product_thumb,
        } = createNewProductDto;

        const product_detail = await this.createProductAttribute(
            product_type,
            product_attributes,
            userId,
        );
        if (!product_detail) {
            throw new BadRequestException('Create product failed.');
        }

        const product = await this.productModel.create({
            product_attributes,
            product_type,
            product_description,
            product_name,
            product_price,
            product_quantity,
            product_thumb,
            _id: product_detail._id,
            product_shop: userId,
        });
        if (!product) {
            throw new BadRequestException('Create product failed.');
        }
        return CommonReturn({
            status: EReturnStatus.SUCCESS,
            statusCode: HttpStatus.CREATED,
            data: { product },
            message: 'Create product success.',
        });
    }

    private async GetProduct(
        shopId: string,
        query: any,
        limit?: number,
        page?: number,
        keyword?: string,
    ) {
        const offset = page * limit - limit;

        const matchStage: any = {
            ...query,
            product_shop: new mongoose.Types.ObjectId(shopId),
        };

        if (keyword) {
            matchStage.$text = { $search: keyword };
        }

        const totalDocs = await this.productModel.aggregate([
            {
                $match: matchStage,
            },
            {
                $count: 'totalCount',
            },
        ]);

        const product = await this.productModel.aggregate([
            {
                $match: matchStage,
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $skip: offset || 0,
            },
            {
                $limit: limit ? limit : 10,
            },
        ]);

        const pageDetail = paginating(totalDocs, page || 1, limit || 10);

        return {
            product,
            pageDetail,
        };
    }

    async handleGetAllDraftProductInShop(
        shopId: string,
        limitPageDto: LimitPageDto,
    ) {
        const { limit, page } = limitPageDto;
        const { product, pageDetail } = await this.GetProduct(
            shopId,
            { isDraft: true, isPublish: false },
            limit,
            page,
        );

        return CommonReturn({
            status: EReturnStatus.SUCCESS,
            statusCode: HttpStatus.OK,
            data: {
                product,
                pageDetail,
            },
            message: 'Get all draft product success.',
        });
    }

    async handlePublishProduct(shopId: string, findProductDto: FindProductDto) {
        const { productId } = findProductDto;
        const product = await this.productModel.findOne({
            _id: productId,
            product_shop: shopId,
            isDraft: true,
            isPublish: false,
        });

        if (!product) {
            throw new BadRequestException(
                'Product not found or product already publish.',
            );
        }

        product.isDraft = false;
        product.isPublish = true;

        const { modifiedCount } = await product.updateOne(product);

        if (!modifiedCount) {
            throw new BadRequestException('Publish failed.');
        }
        return CommonReturn({
            status: EReturnStatus.SUCCESS,
            statusCode: HttpStatus.OK,
            data: {},
            message: 'Publish product success.',
        });
    }

    async handleGetAllPublishProduct(
        getAllPublishProductDto: GetAllPublishProductDto,
    ) {
        const { shopId, limit, page, keyword } = getAllPublishProductDto;
        const { product, pageDetail } = await this.GetProduct(
            shopId,
            { isDraft: false, isPublish: true },
            limit,
            page,
            keyword,
        );

        return CommonReturn({
            status: EReturnStatus.SUCCESS,
            statusCode: HttpStatus.OK,
            data: {
                product,
                pageDetail,
            },
            message: 'Get all publish product success.',
        });
    }

    async handleUnpublishProduct(
        shopId: string,
        findProductDto: FindProductDto,
    ) {
        const { productId } = findProductDto;
        const product = await this.productModel.findOne({
            _id: productId,
            product_shop: shopId,
            isDraft: false,
            isPublish: true,
        });

        if (!product) {
            throw new BadRequestException(
                'Product not found or product is not publish.',
            );
        }

        product.isDraft = true;
        product.isPublish = false;

        const { modifiedCount } = await product.updateOne(product);

        if (!modifiedCount) {
            throw new BadRequestException('Unpublish failed.');
        }
        return CommonReturn({
            status: EReturnStatus.SUCCESS,
            statusCode: HttpStatus.OK,
            data: {},
            message: 'Unpublish product success.',
        });
    }

    async handleFindAllProduct(findAllProductDto: FindAllProductDto) {
        const { keyword, limit, page, sortBy } = findAllProductDto;
        const offset = (page - 1) * limit;

        const matchStage: Record<string, any> = {
            isDraft: false,
            isPublish: true,
        };

        let sort: any = {
            createdAt: -1,
        };

        if (keyword) {
            matchStage.$text = { $search: keyword };
        }
        if (sortBy) {
            sort = {
                createdAt: sortBy,
            };
        }

        const product = await this.productModel.aggregate([
            {
                $match: matchStage,
            },
            {
                $sort: sort,
            },
            {
                $skip: offset || 0,
            },
            {
                $limit: limit || 10,
            },
        ]);

        const totalDocs = await this.productModel.aggregate([
            {
                $match: matchStage,
            },
            {
                $count: 'totalCount',
            },
        ]);

        const pageDetail = paginating(totalDocs, page || 1, limit || 10);

        return CommonReturn({
            status: EReturnStatus.SUCCESS,
            statusCode: HttpStatus.OK,
            data: { product, pageDetail },
            message: 'Search product success.',
        });
    }
}
