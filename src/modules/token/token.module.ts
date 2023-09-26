import { Module, forwardRef } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { Token, TokenSchema } from './schemas/token.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKey, ApiKeySchema } from './schemas/api-key,schema';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Token.name, schema: TokenSchema },
            { name: ApiKey.name, schema: ApiKeySchema },
        ]),
        forwardRef(() => AuthModule),
    ],
    controllers: [TokenController],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule {}
