import {
    BadRequestException,
    ForbiddenException,
    HttpStatus,
    Inject,
    Injectable,
    UnauthorizedException,
    forwardRef,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dtos/login.dto';
import { ShopService } from '../shop/shop.service';
import * as bcrypt from 'bcrypt';
import { CommonReturn } from 'src/common/helpers';
import { EReturnStatus } from 'src/common/common.constant';
import { pickData } from 'src/common/utils';
import { TokenService } from '../token/token.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => ShopService))
        private readonly shopService: ShopService,
        @Inject(forwardRef(() => TokenService))
        private readonly tokenService: TokenService,
    ) {}

    async handleLogin(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const shop = await this.shopService.FindShopByEmail(email);
        if (!shop) {
            throw new BadRequestException('Email does not exist in system.');
        }
        const isMatch = await bcrypt.compare(password, shop.password);
        if (!isMatch) {
            throw new BadRequestException('Incorrect password.');
        }
        const { keyStore, tokens } = await this.tokenService.createToken(shop);
        if (!keyStore) {
            throw new BadRequestException('Key error.');
        }

        return CommonReturn({
            status: EReturnStatus.SUCCESS,
            statusCode: HttpStatus.OK,
            data: { shop: pickData(['_id', 'name', 'email'], shop), tokens },
            message: 'Login success.',
        });
    }

    async handleLogOut(req: Request) {
        const keyStore = req['keyStore'];
        const accessToken = req.headers['authorization'].replace('Bearer ', '');

        await this.tokenService.removeTokenById(keyStore._id, accessToken);

        return CommonReturn({
            status: EReturnStatus.SUCCESS,
            statusCode: HttpStatus.OK,
            data: {},
            message: 'Logout success.',
        });
    }

    async handleRefreshToken(refreshToken: string) {
        //check xem token da duoc su dung chua
        const foundTokenUsed = await this.tokenService.findByRefreshTokenUsed(
            refreshToken,
        );

        //neu roi
        if (foundTokenUsed) {
            const { userId, email }: any = await jwt.verify(
                refreshToken,
                foundTokenUsed.privateKey,
            );

            //xoa token neu vi pham
            await this.tokenService.deleteKeyById(userId);
            throw new BadRequestException(
                'Something went wrong. Please login again.',
            );
        }

        //neu chua
        const holderToken = await this.tokenService.findByRefreshToken(
            refreshToken,
        );

        if (!holderToken) {
            throw new UnauthorizedException('Token not existed.');
        }

        //verify token
        const { userId, email }: any = await jwt.verify(
            refreshToken,
            holderToken.privateKey,
        );

        //check userId co trung voi payload trong refresh token hay ko
        if (holderToken.userId.toString() !== userId.toString())
            throw new UnauthorizedException('Token not valid.');

        //check user
        const foundShop = await this.shopService.FindShopByEmail(email);
        if (!foundShop) {
            throw new UnauthorizedException('Token not existed.');
        }

        //tao token moi
        const token = await this.tokenService.createTokenPair(
            { userId, email },
            holderToken.publicKey,
            holderToken.privateKey,
        );

        await holderToken.updateOne({
            $set: {
                refreshToken: token.refresh_token,
                accessToken: token.access_token,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken, //da duoc su dung de lay token moi
            },
        });

        return CommonReturn({
            status: EReturnStatus.SUCCESS,
            statusCode: HttpStatus.OK,
            data: { user: { userId, email }, token },
            message: 'Refresh success.',
        });
    }
}
