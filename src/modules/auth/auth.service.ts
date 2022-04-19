import {
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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<SignUpDto> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          email: email,
        },
      });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const { password, ...rest } = user;
          return rest;
        }
      }
    } catch (e) {
      throw new NotFoundException();
    }

    return null;
  }

  async login(userDto: UserEntity) {
    const user = await this.validateUser(userDto.email, userDto.password);

    if (user) {
      const payload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload);

      return {
        ...user,
        access_token,
      };
    }
    throw new UnauthorizedException();
  }

  async logout(user: any) {
    return null;
  }

  async signUp(SignUpDto: SignUpDto) {
    //TODO: Provjera jel postoji user u bazi
    const hash = await bcrypt.hash(SignUpDto.password, 10);
    const user = await this.userRepository.save({
      id: SignUpDto.id,
      email: SignUpDto.email,
      password: hash,
    });
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    return {
      id: user.id,
      email: user.email,
      access_token,
    };
  }

  async refreshTokens(user: any) {
    return null;
  }
}
