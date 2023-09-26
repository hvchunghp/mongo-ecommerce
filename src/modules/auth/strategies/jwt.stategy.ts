import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from 'src/modules/token/token.service';
import mongoose from 'mongoose';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly tokenService: TokenService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKeyProvider: async (request: Request, jwtToken, done) => {
                try {
                    const clientId = <string>request.headers['x-client-id'];

                    if (!clientId)
                        throw new UnauthorizedException(
                            'x-client-id header is missing',
                        );

                    if (!mongoose.Types.ObjectId.isValid(clientId))
                        throw new BadRequestException(
                            'x-client-id must be mongoId.',
                        );

                    const accessToken = request.headers.authorization.replace(
                        'Bearer ',
                        '',
                    );
                    const keyStore = await this.tokenService.findTokenByUserId(
                        clientId,
                        accessToken,
                    );

                    if (!keyStore) throw new UnauthorizedException();
                    request['keyStore'] = keyStore;

                    const secretOrKey = keyStore.publicKey;

                    done(null, secretOrKey);
                } catch (error) {
                    done(error);
                }
            },
        });
    }

    async validate(payload: any) {
        return payload;
    }

    validateRequest(request: Request) {
        return super.validateRequest(request);
    }
}
