import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from 'src/entities/auth.entity';
import { JWTPayload } from 'src/interface/jwt.payload';
import { UserLoginResource } from 'src/resource/user/user-login.resource';
import { DeleteResult, getRepository } from 'typeorm';
import { ResponseData } from '../../interface/response.interface';
import { UserRepository } from './auth.repository';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
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
      data: {
        user: await UserLoginResource(user, user),
        tokens,
      },
      message: 'Create User Successfully!',
    };

    return responseData;
  }

  async login(loginUserDto: LoginUserDto) {
    const { account, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: [{ user_name: account }, { phone: account }, { email: account }],
    });
    let checkPass = false;
    if (user) {
      checkPass = bcrypt.compareSync(password, user.password);
    }

    if (user && checkPass) {
      const tokens = await this.getTokens(user.id, user.user_name);
      await this.updateRtHash(user.id, tokens.refresh_token);
      const responseData: ResponseData = {
        data: {
          user: await UserLoginResource(user, user),
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
    console.log("Reset Token", user)
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
    const hashData = bcrypt.hashSync(data, 8);
    return hashData;
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
          expiresIn: 60 * 60 * 24,
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

  async getAllUser(): Promise<User[]> {
    const users = await this.userRepository.find()
    return users
  }

  async deleteUser(idUser: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: [{ id: idUser }],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const result = await this.userRepository.remove(user)
  }

  getJwtUser(jwt: string):Observable<Promise<User> | null> {
    // console.log(jwt)
    // console.log('FFF', this.jwtService.verifyAsync(jwt, {
    //   secret: this.config.get('JWT_SECRET')
    // }))
    return from(this.jwtService.verifyAsync(jwt, {
      secret: this.config.get('JWT_SECRET')
    }))
    .pipe(
      map(async (payload : JWTPayload) => {
        const useAuth = await getRepository(User).findOne({
          where: [{ id: payload.sub }],
        });
        // console.log('FUCK YOU',user)
        return useAuth;
      }),
      catchError(() => {
        return of(null);
      }),
    );
  } 

  // async getJwtUser(jwt: string): Promise<User | undefined> {
  //   console.log('154',jwt)
  //   return  await this.jwtService.verifyAsync(jwt, {
  //     secret: this.config.get('JWT_SECRET')
  //   })
   
  // }
}
