import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersAuthModule } from './users-auth/user-auth.module';

@Module({
  imports: [UsersAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
