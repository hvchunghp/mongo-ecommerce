import { Controller } from '@nestjs/common';
import { TokenService } from './token.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('token')
@ApiTags('token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) {}
}
