import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtGuard } from 'src/common/guards';
import { AuthModule } from './auth/auth.module';
import { config } from './config';
import { AppConfigModule } from './config/app.config';
import { PostModule } from './post/post.module';
import { RelationModule } from './relation/relation.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { PostController } from './post/post.controller';
import { RelationController } from './relation/relation.controller';
import { StoryModule } from './story/story.module';

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
          logging: true,
        };
      },
    }),
    AuthModule,
    PostModule,
    AppConfigModule,
    RelationModule,
    UserModule,
    StoryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: 'CONFIG_APP',
      useValue: new ConfigService(),
    },
  ],
})
export class AppModule {}
