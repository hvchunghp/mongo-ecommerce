import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dtos/create-new-shop.dto';

@Controller('shop')
@ApiTags('shop')
export class ShopController {
    constructor(private readonly shopService: ShopService) {}

    @Post('/create-shop')
    async CreateShop(
        @Headers('x-api-key') apiKey: string,
        @Body() createShopDto: CreateShopDto,
    ) {
        return await this.shopService.CreateNewShop(createShopDto);
    }
}
