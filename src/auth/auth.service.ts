import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRequestDto } from 'src/dtos/request/user.dto';
import { UserResponseDto } from 'src/dtos/response/user.dto';
import { UserService } from 'src/user/user.service';
import { DefaultCategories } from 'src/utils/constants';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
// import jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  signUp(userDto: UserRequestDto): Promise<UserResponseDto> {
    return this.userService.createUser(userDto);
  }

  async login(body: any): Promise<any> {
    let userInfo = await this.userService.findByEmail(body.email);
    console.log('userInfo:', userInfo);
    if (!userInfo) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const validPwd = await bcrypt.compare(body.password, userInfo.password);
    if (!validPwd) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      token: this.jwtService.sign({ sub: userInfo.id }),
      email: userInfo.email,
    };
  }
}
