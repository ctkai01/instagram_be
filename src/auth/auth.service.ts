import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interface/jwt-payload.interface';
import { ResponseData } from './interface/response.interface';
import { LoginUserDto } from './dto/login-user-dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './auth.repository';
import { User } from './auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './interface/token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<ResponseData> {
    createUserDto.password = await this.hashData(createUserDto.password);

    const user: User = await this.userRepository.createUser(createUserDto);
    const tokens = await this.getTokens(user.id, user.user_name);
    await this.updateRtHash(user.id, tokens.refresh_token);

    const responseData: ResponseData = {
      data: user,
      message: 'Create User Successfully!',
      tokens,
    };

    return responseData;
  }

  async login(loginUserDto: LoginUserDto) {
    const { account, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: [{ user_name: account }, { phone: account }, { email: account }],
    });
    if (user && bcrypt.compare(password, user.password)) {
      const tokens = await this.getTokens(user.id, user.user_name);
      await this.updateRtHash(user.id, tokens.refresh_token);

      const responseData: ResponseData = {
        data: {
          user,
          tokens,
        },
        message: 'Login Successfully!',
      };
      return responseData;
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async logout(userId: number) {
    const user = await this.userRepository.findOne({
      where: [{ id: userId }],
    });
    user.refresh_token = null;

    await this.userRepository.save(user);
  }

  async refreshToken(userId: number, rf: string) {
    const user = await this.userRepository.findOne({
      where: [{ id: userId }],
    });
    if (user && bcrypt.compare(rf, user.refresh_token)) {
      const tokens = this.getTokens(userId, user.user_name);
      await this.updateRtHash(userId, (await tokens).refresh_token);
      return tokens;
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async hashData(data: string): Promise<string> {
    // const salt = await bcrypt.genSalt();
    // console.log('SSS', salt);
    return await bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, userName: string): Promise<Tokens> {
    const [at, rf] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          userName,
        },
        {
          secret: this.config.get('JWT_SECRET'),
          expiresIn: 60 * 24,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          userName,
        },
        {
          secret: this.config.get('JWT_REFRESH'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rf,
    };
  }

  async updateRtHash(userId: number, rf: string): Promise<void> {
    const hashRf = await this.hashData(rf);
    const user = await this.userRepository.findOne({
      where: [{ id: userId }],
    });
    user.refresh_token = hashRf;

    await this.userRepository.save(user);
  }
}
