import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { UserEntity } from './auth.entity';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() user: SignUpDto): any {
    return this.authService.signUp(user);
  }

  @Post('login')
  login(@Body() user: UserEntity): any {
    return this.authService.login(user);
  }

  @Post('logout')
  logout(@Request() req): any {
    return this.authService.logout(req.user);
  }

  // if is loged in example
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getHello(@Request() req): any {
    return req.user;
  }
}
