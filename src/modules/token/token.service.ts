import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './schemas/token.schema';
import mongoose, { Model } from 'mongoose';
import { ApiKey } from './schemas/api-key,schema';
import * as crypto from 'crypto';
import { AuthService } from '../auth/auth.service';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class TokenService {
    constructor(
        @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
        @InjectModel(ApiKey.name) private readonly apiKeyModel: Model<ApiKey>,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
    ) {}

    async decodeJwtToken(token, secret) {
        await jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                throw err;
            } else {
                console.log(decoded);

                return decoded;
            }
        });
    }

    async createKeyToken({
        userId,
        publicKey,
        privateKey,
        accessToken,
        refreshToken,
    }) {
        //lv0
        // // const publicKeyString = publicKey.toString();
        // const tokens = await this.tokenModel.create({
        //     userId,
        //     // publicKey: publicKeyString,
        //     publicKey,
        //     privateKey,
        // });

        // return tokens ? tokens.publicKey : null;

        //lv pro
        const tokens = await await this.tokenModel.create({
            userId,
            publicKey,
            privateKey,
            refreshTokensUsed: [],
            accessToken,
            refreshToken,
        });
        return tokens ? tokens.publicKey : null;
    }

    async createTokenPair(payload, publicKey, privateKey) {
        try {
            const access_token = jwt.sign(payload, publicKey, {
                expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
                // algorithm: process.env.JWT_ALGORITHM as jwt.Algorithm,
            });

            const refresh_token = jwt.sign(payload, privateKey, {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
                // algorithm: process.env.JWT_ALGORITHM as jwt.Algorithm,
            });

            // jwt.verify(access_token, publicKey, (err, decoded) => {
            //     if (err) {
            //         console.error('error verify: ', err);
            //     } else {
            //         console.log('decode success: ', decoded);
            //     }
            // });

            return {
                access_token,
                refresh_token,
            };
        } catch (error) {
            console.log(error);
        }
    }

    async createToken(shop) {
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');
        const tokens = await this.createTokenPair(
            {
                userId: shop._id,
                email: shop.email,
            },
            publicKey,
            privateKey,
        );
        const keyStore: String = await this.createKeyToken({
            userId: shop._id,
            publicKey,
            privateKey,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
        });
        return { tokens, keyStore };
    }

    async findKeyById(key: string) {
        const objKey = await this.apiKeyModel
            .findOne({
                key,
                status: true,
            })
            .lean();

        return objKey;
    }

    async findTokenByUserId(userId: string, accessToken: string) {
        const res = await this.tokenModel
            .findOne({
                userId: new mongoose.Types.ObjectId(userId),
                accessToken,
            })
            .lean();
        return res;
    }

    async removeTokenById(_id: string, accessToken: string) {
        await this.tokenModel.deleteOne({ _id, accessToken });
    }

    async findByRefreshTokenUsed(refreshToken: string) {
        return await this.tokenModel
            .findOne({
                refreshTokensUsed: refreshToken,
            })
            .lean();
    }

    async findByRefreshToken(refreshToken: string) {
        return await this.tokenModel.findOne({
            refreshToken,
        });
    }

    async deleteKeyById(userId: string) {
        return await this.tokenModel.findOneAndRemove({
            userId,
        });
    }
}
