import {
    Body,
    Controller,
    Delete,
    Headers,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { JwtAuthGuard } from './guards/auth.guard';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    async Login(@Body() loginDto: LoginDto) {
        return this.authService.handleLogin(loginDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('/logout')
    async Logout(
        @Headers('x-client-id') clientId: string,
        @Req() request: Request,
    ) {
        return await this.authService.handleLogOut(request);
    }

    @Post('/refresh-token')
    async RefreshToken(@Headers('x-refresh-token') refreshToken: string) {
        return await this.authService.handleRefreshToken(refreshToken);
    }
}
