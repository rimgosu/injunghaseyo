import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/common/get-user.decorator';
import { User } from '@prisma/client';
import { CreateGroupParams } from './dtos/create-group-params.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard())
  async createGroup(@GetUser() user: User, @Query() params: CreateGroupParams) {
    return this.groupService.createGroup(user, params);
  }
}
