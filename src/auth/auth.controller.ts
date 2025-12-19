import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRequestDto } from 'src/dtos/request/user.dto';
import { UserResponseDto } from 'src/dtos/response/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() body: UserRequestDto): Promise<UserResponseDto> {
        const user = await this.authService.signUp(body);
        return user;
    }

    @Post('login')
    async login(@Body() body: any): Promise<UserResponseDto> {
        const data = await this.authService.login(body);
        return data;
    }
}
