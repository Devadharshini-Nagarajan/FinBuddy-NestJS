import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UserRequestDto } from 'src/dtos/request/user.dto';
import { UserResponseDto } from 'src/dtos/response/user.dto';
import { UserService } from 'src/user/user.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserProfile(@Param('id') id: string): Promise<UserResponseDto> {
    if (!id) {
      throw new Error('User ID not found in request');
    }
    const user = await this.userService.getUserProfile(id);
    return user;
  }

  @Get()
  async getUser(@Req() req): Promise<any> {
    const user = await this.userService.getUserFromToken(req);
    return user;
  }

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
  //   await this.userService.deleteUser(id);
  // }
}
