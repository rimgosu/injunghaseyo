import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { PrismaModule } from './prisma/prisma.module';
import { GroupModule } from './group/group.module';
import { OpenaiModule } from './openai/openai.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config) => {
        const store = await redisStore({
          ttl: 180 * 1000,
          socket: {
            host: config.get('redis.host'),
            port: config.get('redis.port'),
          },
          password: config.get('redis.password'),
        });
        return { store };
      },
    }),
    EmailModule,
    GroupModule,
    OpenaiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
