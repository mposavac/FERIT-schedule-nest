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
import { SignUpDto } from './dto/signUp.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description: 'Successful Signup.',
    type: LoginResponseDto,
  })
  @Post('signup')
  signup(@Body() user: SignUpDto): Promise<LoginResponseDto> {
    return this.authService.signUp(user);
  }

  @ApiOkResponse({
    description: 'Successful Login.',
    type: LoginResponseDto,
  })
  @Post('login')
  login(@Body() user: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(user);
  }

  @ApiOkResponse({
    description: 'Successful Logout.',
    //TODO: add type: SignUpResponseDto,
  })
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
