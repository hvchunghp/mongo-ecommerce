import {
    BadRequestException,
    ForbiddenException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import mongoose, { Model } from 'mongoose';
import {
    CreateNewProductDto,
    ProductAttributeDto,
} from './dtos/create-new-product.dto';
import { CommonReturn, paginating } from 'src/common/helpers';
import { CommonUnSelect, EReturnStatus } from 'src/common/common.constant';
import { EProductType } from './product.constant';
import { LimitPageDto } from 'src/common/dto/limit-page';
import { GetAllPublishProductDto } from './dtos/get-all-publish-product.dto';
import { FindProductDto } from './dtos/find-product.dto';
import { FindAllProductDto } from './dtos/find-all-product.dto';
import {
    UpdateProductAttributeDto,
    UpdateProductDto,
} from './dtos/update-product.dto';
import { ClothingService } from './productTypeService/clothing.service';
import { ElectronicService } from './productTypeService/electronic.service';
import { FurnitureService } from './productTypeService/furniture.service';
import { pickData } from 'src/common/utils';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<Product>,

        private readonly clothingService: ClothingService,
        private readonly electronicService: ElectronicService,
        private readonly furnitureService: FurnitureService,
    ) {
        this.registerType(EProductType.CLOTHING, this.clothingService);
        this.registerType(EProductType.ELECTRONIC, this.electronicService);
        this.registerType(EProductType.FURNITURE, this.furnitureService);
    }

    private productRegistry = {};

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

        return await productRef.createProduct(
            productAttributeDto,
            product_shop,
        );
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
        const productAttribute = pickData(
            ['manufacture', 'brand', 'material', 'size'],
            product_detail,
        );

        const product = await this.productModel.create({
            product_attributes: productAttribute,
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
                $project: CommonUnSelect,
            },
            {
                $lookup: {
                    from: 'shops',
                    localField: 'product_shop',
                    foreignField: '_id',
                    as: 'ownedBy',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                email: 1,
                            },
                        },
                    ],
                },
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
            message: 'Find products success.',
        });
    }

    async findProductById(findProductDto: FindProductDto) {
        const { productId } = findProductDto;
        const [product] = await this.productModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(productId),
                    isDraft: false,
                    isPublish: true,
                },
            },
            {
                $project: CommonUnSelect,
            },
            {
                $lookup: {
                    from: 'shops',
                    localField: 'product_shop',
                    foreignField: '_id',
                    as: 'ownedBy',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                email: 1,
                            },
                        },
                    ],
                },
            },
        ]);

        if (!product) {
            throw new BadRequestException('Product not existed.');
        }

        return CommonReturn({
            status: EReturnStatus.SUCCESS,
            statusCode: HttpStatus.OK,
            data: { product },
            message: 'Find product success.',
        });
    }

    private async updateProductAttribute(
        product_type: string,
        updateProductAttributeDto: UpdateProductAttributeDto,
        product_id: string,
    ) {
        const productRef = this.productRegistry[product_type];

        if (!productRef) {
            throw new BadRequestException('Invalid product type.');
        }

        return await productRef.updateProduct(
            updateProductAttributeDto,
            product_id,
        );
    }

    async updateProduct(shopId: string, updateProductDto: UpdateProductDto) {
        const {
            productId,
            product_name,
            product_thumb,
            product_description,
            product_price,
            product_quantity,
            product_attributes,
            product_type,
        } = updateProductDto;
        const product: any = await this.productModel
            .findOne({
                _id: productId,
            })
            .lean();
        if (!product) {
            throw new BadRequestException('Product not existed.');
        }
        if (product.product_shop.toString() !== shopId) {
            throw new ForbiddenException(
                'You do not have the right to execute this.',
            );
        }
        let product_detail;
        if (product_attributes) {
            product_detail = await this.updateProductAttribute(
                product_type,
                product_attributes,
                productId,
            );
            if (!product_detail) {
                throw new BadRequestException(
                    'Update product attribute failed.',
                );
            }
            product_detail = pickData(
                ['manufacture', 'brand', 'material', 'size'],
                product_detail,
            );
        }
        const new_product_data = await this.productModel
            .findOneAndUpdate(
                {
                    _id: productId,
                },
                {
                    $set: {
                        product_name,
                        product_thumb,
                        product_description,
                        product_price,
                        product_quantity,
                        product_attributes: product_detail,
                    },
                },
                {
                    new: true,
                },
            )
            .lean();

        if (!new_product_data) {
            throw new BadRequestException('Update product failed.');
        }
        return CommonReturn({
            status: EReturnStatus.SUCCESS,
            statusCode: HttpStatus.OK,
            data: { new_product_data },
            message: 'Update product success.',
        });
    }
}
