import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '@/common/get-user.decorator';
import { User } from '@prisma/client';
import { CreateGroupParams } from './dtos/create-group-params.dto';
import { AtkGuard } from '@/users-auth/guards/atk.guard';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  /**
   * @todo 태그 기능 완성 후 새로 작성
   */
  @Post()
  @ApiBearerAuth('jwt')
  @UseGuards(AtkGuard)
  async createGroup(@GetUser() user: User, @Query() params: CreateGroupParams) {
    return this.groupService.createGroup(user, params);
  }
}
