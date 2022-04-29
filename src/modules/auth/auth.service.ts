import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/signUp.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<{ id: string; email: string; username: string }> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          email: email,
        },
      });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const { id, email, username } = user;
          return { id, email, username };
        }
      }
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Please check your e-mail and password!',
        },
        HttpStatus.CONFLICT,
      );
    }

    return null;
  }

  async login(userDto: LoginDto) {
    const user = await this.validateUser(userDto.email, userDto.password);

    if (user) {
      const payload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload);
      const refresh_token = 'REFRESH';

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        access_token,
        refresh_token,
      };
    }
    throw new HttpException(
      {
        status: HttpStatus.CONFLICT,
        error: 'Please check your e-mail and password!',
      },
      HttpStatus.CONFLICT,
    );
  }

  async logout(user: any) {
    return null;
  }

  async signUp(SignUpDto: SignUpDto) {
    const existingUser = await this.userRepository.findAndCount({
      where: {
        email: SignUpDto.email,
      },
    });
    if (existingUser[1]) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'There is already user with that email.',
        },
        HttpStatus.CONFLICT,
      );
    } else {
      const hash = await bcrypt.hash(SignUpDto.password, 10);
      const user = await this.userRepository.save({
        username: SignUpDto.username,
        email: SignUpDto.email,
        password: hash,
      });
      const payload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload);
      const refresh_token = 'REFRESH';
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        access_token,
        refresh_token,
      };
    }
  }

  async refreshTokens(user: any) {
    return null;
  }
}
