import {
    BadRequestException,
    HttpStatus,
    Inject,
    Injectable,
    forwardRef,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Shop } from './schemas/shop.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateShopDto } from './dtos/create-new-shop.dto';
import * as bcrypt from 'bcrypt';
import { CommonReturn } from 'src/common/helpers';
import { EReturnStatus } from 'src/common/common.constant';
import { EShopRole } from './shop.constant';
import { TokenService } from '../token/token.service';
import { pickData } from 'src/common/utils';
@Injectable()
export class ShopService {
    constructor(
        @InjectModel(Shop.name) private readonly shopModel: Model<Shop>,
        private readonly tokenService: TokenService,
    ) {}

    async hashPassword(password: string) {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds);
        return hash;
    }

    async CreateNewShop(createShopDto: CreateShopDto) {
        const { name, email, password, status, verify } = createShopDto;
        const shop = await this.shopModel.create({
            name,
            email,
            password: await this.hashPassword(password),
            status,
            verify,
            roles: EShopRole.SHOP,
        });
        if (!shop) {
            throw new BadRequestException('Create shop failed.');
        }

        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //     modulusLength: 4096,
        //     publicKeyEncoding: {
        //         type: 'pkcs1',
        //         format: 'pem',
        //     },
        //     privateKeyEncoding: {
        //         type: 'pkcs1',
        //         format: 'pem',
        //     },
        // });

        const { keyStore, tokens } = await this.tokenService.createToken(shop);
        if (!keyStore) {
            throw new BadRequestException('Key error.');
        }
        // const publicKeyObject = crypto.createPublicKey(
        //     publicKeyString.toString(),
        // );

        return CommonReturn({
            status: EReturnStatus.SUCCESS,
            statusCode: HttpStatus.CREATED,
            data: { shop: pickData(['_id', 'name', 'email'], shop), tokens },
            message: 'Create shop success.',
        });
    }

    async FindShopByEmail(email: string) {
        const shop = await this.shopModel
            .findOne({
                email,
            })
            .lean();

        return shop;
    }

    async validateShop(_id: string, email: string) {
        const shop = await this.shopModel
            .findOne({
                email,
                _id,
            })
            .lean();
        return shop;
    }
}
