import {
    Body,
    Controller,
    Get,
    Headers,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { CreateNewProductDto } from './dtos/create-new-product.dto';
import { User } from 'src/common/decorator/user.decorator';
import { IUser } from 'src/common/common.interface';
import { LimitPageDto } from '../../common/dto/limit-page';
import { GetAllPublishProductDto } from './dtos/get-all-publish-product.dto';
import { FindProductDto } from './dtos/find-product.dto';
import { FindAllProductDto } from './dtos/find-all-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@ApiTags('product')
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post('/create-product')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async createNewProduct(
        @Body() createNewProductDto: CreateNewProductDto,
        @Headers('x-client-id') clientId: string,
    ) {
        return await this.productService.handleCreateProduct(
            createNewProductDto,
            clientId,
        );
    }

    @Get('/get-all-draft-product-in-shop')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getAllDraftProduct(
        @Headers('x-client-id') clientId: string,
        @Query() limitPageDto: LimitPageDto,
    ) {
        return await this.productService.handleGetAllDraftProductInShop(
            clientId,
            limitPageDto,
        );
    }

    @Put('/publish-product')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async publishProduct(
        @Headers('x-client-id') clientId: string,
        @Body() findProductDto: FindProductDto,
    ) {
        return await this.productService.handlePublishProduct(
            clientId,
            findProductDto,
        );
    }

    @Get('/get-all-publish-product-in-shop')
    async getAllPublishProduct(
        @Query() getAllPublishProductDto: GetAllPublishProductDto,
    ) {
        return await this.productService.handleGetAllPublishProduct(
            getAllPublishProductDto,
        );
    }

    @Put('/unpublish-product')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async unpublishProduct(
        @Headers('x-client-id') clientId: string,
        @Body() findProductDto: FindProductDto,
    ) {
        return await this.productService.handleUnpublishProduct(
            clientId,
            findProductDto,
        );
    }

    @Get('/find-all-product')
    async findAllProduct(@Query() findAllProductDto: FindAllProductDto) {
        return await this.productService.handleFindAllProduct(
            findAllProductDto,
        );
    }

    @Get('/find-product-by-id')
    async findProductById(@Query() findProductDto: FindProductDto) {
        return await this.productService.findProductById(findProductDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch('/update-product')
    async updateProduct(
        @Body() updateProductDto: UpdateProductDto,
        @Headers('x-client-id') clientId: string,
    ) {
        return await this.productService.updateProduct(
            clientId,
            updateProductDto,
        );
    }
}
