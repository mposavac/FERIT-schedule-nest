import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/signUp.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshDto } from './dto/refresh.dto';

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
      const [access_token, refresh_token] = await this.getTokens(payload);
      await this.updateSavedToken(user.id, refresh_token);

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
        refreshToken: '',
      });
      const payload = { email: user.email, sub: user.id };
      const [access_token, refresh_token] = await this.getTokens(payload);
      await this.updateSavedToken(user.id, refresh_token);

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        access_token,
        refresh_token,
      };
    }
  }

  async logout(userDto: LogoutDto) {
    await this.userRepository.update(userDto.id, {
      refreshToken: '',
    });
  }

  async refreshTokens(userDto: RefreshDto) {
    try {
      this.jwtService.verify(userDto.refresh_token, {
        secret: process.env.REFRESH_SECRET,
      });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Invalid token!',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id: userDto.id },
      });
      if (user) {
        const isMatch = await bcrypt.compare(
          userDto.refresh_token,
          user.refreshToken,
        );
        if (isMatch) {
          const payload = { email: user.email, sub: user.id };
          const access_token = this.jwtService.sign(payload);

          const { id, email, username } = user;
          return {
            id,
            email,
            username,
            access_token,
            refresh_token: userDto.refresh_token,
          };
        } else throw new ForbiddenException('Access Denied');
      }
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'User not found!',
        },
        HttpStatus.CONFLICT,
      );
    }
    return null;
  }

  async getTokens(payload: any) {
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: 60 * 60 * 24 * 7 + 's',
    });
    return [access_token, refresh_token];
  }

  async updateSavedToken(id: string, refresh_token: string) {
    const refreshToken = await bcrypt.hash(refresh_token, 10);
    await this.userRepository.update(id, {
      refreshToken,
    });
  }
}
