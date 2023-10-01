import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { CreateDiscountDto } from './dtos/create-discount.dto';

@ApiTags('discount')
@Controller('discount')
export class DiscountController {
    constructor(private readonly discountService: DiscountService) {}

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('/create-discount')
    async createDiscount(
        @Body() createDiscountDto: CreateDiscountDto,
        @Headers('x-client-id') clientId: string,
    ) {
        return await this.discountService.CreateDiscount(createDiscountDto, clientId);
    }
}
