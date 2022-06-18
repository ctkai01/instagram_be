import { Module, Scope } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmConnectionFactory, TypeOrmModule } from '@nestjs/typeorm';
import moment from 'moment';
import { AtGuard } from 'src/guards';
import { AuthModule } from './module/auth/auth.module';
import { config } from './config';
import { AppConfigModule } from './config/app.config';
import { PostModule } from './module/post/post.module';
import { RelationModule } from './module/relation/relation.module';
import { StoryModule } from './module/story/story.module';
import { UserModule } from './module/user/user.module';
import { User } from './entities/auth.entity';
import { Relation } from './entities/relation.entity';
import { PostUser } from './entities/post-user.entity';
import { Media } from './entities/media.entity';
import { Post } from './entities/post.entity';
import { Story } from './entities/story.entity';
import { Connection, ConnectionOptions, getConnection } from 'typeorm';

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
      // connectionFactory: async (options?: ConnectionOptions): Promise<Connection> => {
      //   return {
      //     then(onfulfilled?, onrejected?) {
      //       // onfulfilled(
      //       //   getConnection()
      //       // })
      //       onrejected((value: any) => {
      //         console.log('Value', value)
      //         getConnection(options.synchronize).connect()
      //       })
      //     },
      //   }
      // }
      // ,
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
          keepConnectionAlive: true,
          // retryAttempts: true,
          entities: [User, Relation, PostUser, Media, Post, Story],
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
