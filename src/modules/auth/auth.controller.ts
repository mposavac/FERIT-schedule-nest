import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './auth.entity';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description: 'Successful Signup.',
    //TODO: add type: SignUpResponseDto,
  })
  @Post('signup')
  signup(@Body() user: SignUpDto): any {
    return this.authService.signUp(user);
  }

  @ApiOkResponse({
    description: 'Successful Login.',
    //TODO: add type: SignUpResponseDto,
  })
  @Post('login')
  login(@Body() user: UserEntity): any {
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
