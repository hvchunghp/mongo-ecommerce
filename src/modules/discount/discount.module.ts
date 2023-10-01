import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount, DiscountSchema } from './schemas/discount.schema';
import { ProductModule } from '../product/product.module';
import { CheckCreateDiscount } from './middlewares/create-discount.middleware';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Discount.name, schema: DiscountSchema },
        ]),
        ProductModule,
    ],
    controllers: [DiscountController],
    providers: [DiscountService],
})
export class DiscountModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CheckCreateDiscount).forRoutes({
            path: '/discount/create-discount',
            method: RequestMethod.POST,
        });
    }
}
