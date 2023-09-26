import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TokenService } from 'src/modules/token/token.service';

const HEADER = {
    ApiKey: 'x-api-key',
};

@Injectable()
export class CheckApiKey implements NestMiddleware {
    constructor(private readonly tokenService: TokenService) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const header = req.headers;

        if (!header[HEADER.ApiKey]) {
            throw new UnauthorizedException('Forbidden error');
        }

        const apiKeyObj = await this.tokenService.findKeyById(
            header[HEADER.ApiKey].toString(),
        );

        if (!apiKeyObj) {
            throw new UnauthorizedException('Forbidden error');
        }

        next();
    }
}
