import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshDto } from './dto/refresh.dto';
import { SignUpDto } from './dto/signUp.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOkResponse({
    description: 'Successful Signup.',
    type: LoginResponseDto,
  })
  signup(@Body() user: SignUpDto): Promise<LoginResponseDto> {
    return this.authService.signUp(user);
  }

  @Post('login')
  @ApiOkResponse({
    description: 'Successful Login.',
    type: LoginResponseDto,
  })
  login(@Body() user: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOkResponse({
    description: 'Successful Logout.',
  })
  logout(@Body() user: LogoutDto): Promise<void> {
    return this.authService.logout(user);
  }

  @Post('refresh')
  @ApiOkResponse({
    description: 'Successful Resfreshing.',
    type: LoginResponseDto,
  })
  refresh(@Body() user: RefreshDto): Promise<LoginResponseDto> {
    return this.authService.refreshTokens(user);
  }

  // if is loged in example
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getHello(@Request() req): any {
    return req.user;
  }
}
