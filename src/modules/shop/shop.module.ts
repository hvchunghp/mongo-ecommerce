import {
    MiddlewareConsumer,
    Module,
    RequestMethod,
} from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from './schemas/shop.schema';
import { CheckExistedEmail } from './middlewares/check-existed-shop.middleware';
import { TokenModule } from '../token/token.module';
import { CheckApiKey } from 'src/common/common.middleware';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),
        TokenModule,
    ],
    controllers: [ShopController],
    providers: [ShopService],
    exports: [ShopService],
})
export class ShopModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CheckApiKey, CheckExistedEmail).forRoutes({
            path: '/shop/create-shop',
            method: RequestMethod.POST,
        });
    }
}
