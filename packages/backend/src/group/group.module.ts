import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { UsersAuthModule } from '@/users-auth/user-auth.module';

@Module({
  imports: [UsersAuthModule],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
