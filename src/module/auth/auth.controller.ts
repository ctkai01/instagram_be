import {
  Body,
  Controller,
  Post,
  Request,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/decorators';
import { AtGuard, RtGuard } from 'src/guards';
import { TransformInterceptor } from '../../custom-response/core.response';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { HttpExceptionValidateFilter } from '../../filter/http-exception.filter';
import { ResponseData } from '../../interface/response.interface';
import { Tokens } from './interface/token.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @UseInterceptors(TransformInterceptor)
  @UseFilters(new HttpExceptionValidateFilter())
  signup(@Body() createUserDto: CreateUserDto): Promise<ResponseData> {
    return this.authService.createUser(createUserDto);
  }

  @Public()
  @Post('/login')
  @UseInterceptors(TransformInterceptor)
  @UseFilters(new HttpExceptionValidateFilter())
  login(@Body() loginUserDto: LoginUserDto): Promise<ResponseData> {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  logout(@GetCurrentUserId() userId: number): Promise<void> {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refreshToken')
  refreshToken(
    @Request() req: any,
    @GetCurrentUser('refresh_token') refreshToken: string,
    @GetCurrentUserId() userId: any,
  ): Promise<Tokens> {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
