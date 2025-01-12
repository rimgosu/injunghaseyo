import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserMgmtController } from './user-mgmt.controller';
import { UserMgmtService } from './user-mgmt.service';

@Module({
  controllers: [UserController, UserMgmtController],
  providers: [UserService, UserMgmtService],
})
export class UserModule {}
