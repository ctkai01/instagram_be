import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/decorators';
import { AtGuard, RtGuard } from 'src/common/guards';
import { TransformInterceptor } from './../custom-response/core.response';
import { User } from './auth.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { HttpExceptionValidateFilter } from './exception/http-exception.filter';
import { ResponseData } from './interface/response.interface';

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
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refreshToken')
  refreshToken(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserId() userId: any,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
