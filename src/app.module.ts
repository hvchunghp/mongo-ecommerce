import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopModule } from './modules/shop/shop.module';
import { TokenModule } from './modules/token/token.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { DiscountModule } from './modules/discount/discount.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            useFactory: async () => ({
                uri: process.env.MONGODB_URI,
                useNewUrlParser: true,
            }),
        }),
        ShopModule,
        TokenModule,
        AuthModule,
        ProductModule,
        InventoryModule,
        DiscountModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
