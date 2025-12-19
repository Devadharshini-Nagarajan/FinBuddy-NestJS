import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import { DatabaseService } from 'src/database/database.service';
import { UserRequestDto } from 'src/dtos/request/user.dto';
import { UserResponseDto } from 'src/dtos/response/user.dto';
import { DefaultCategories } from 'src/utils/constants';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DatabaseService) {}

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(userDto: UserRequestDto): Promise<UserResponseDto> {
    // Here we create a user and resp default categories
    const hashedPwd = await bcrypt.hash(userDto.password, 10);
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: userDto.email,
          username: userDto.username,
          password: hashedPwd,
        },
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Create default categories for this user
      await tx.category.createMany({
        data: DefaultCategories.map((category) => ({
          userId: user.id,
          name: category.name,
          description: category.description,
          isActive: true,
        })),
      });

      return user;
    });

    return result;
  }

  async findByEmail(email: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: { email: email },
    });
    return user;
  }

  async login(body: any): Promise<UserResponseDto> {
    let userInfo = await this.prisma.user.findFirst({
      where: { email: body.email },
    });
    if (!userInfo) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const validPwd = await bcrypt.compare(body.password, userInfo.password);
    if (!validPwd) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { password, ...safe } = userInfo;
    // const token = jwt.sign(
    //   {
    //     userId: userInfo.id,
    //     email: userInfo.email,
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: '2h',
    //   },
    // );
    return safe;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
