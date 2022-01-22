import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtGuard } from 'src/common/guards';
import { AuthModule } from './auth/auth.module';
import { config } from './config';
import { AppConfig } from './config/app.config';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    MulterModule.register({
      dest: '/uploads',
    }),
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      // validationSchema: configValidateSchema,
      isGlobal: true,
      load: [config],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          autoLoadEntities: true,
          synchronize: true,
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
        };
      },
    }),
    AuthModule,
    PostModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    AppConfig,
  ],
})
export class AppModule {}
