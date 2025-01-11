import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '@/common/get-user.decorator';
import { User } from '@prisma/client';
import { CreateGroupParams } from './dtos/create-group-params.dto';
import { AtkGuard } from '@/users-auth/guards/atk.guard';
import { GetTagsParams } from './dtos/get-tags-param.dto';
import { GetTagsRes } from './dtos/get-tags-res.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  /**
   * @description 그룹 생성
   */
  @Post()
  @ApiBearerAuth('jwt')
  @UseGuards(AtkGuard)
  async createGroup(@GetUser() user: User, @Query() params: CreateGroupParams) {
    return this.groupService.createGroup(user, params);
  }

  /**
   * @description 태그 검색 - 자동완성
   */
  @Get('tags')
  @ApiBearerAuth('jwt')
  @UseGuards(AtkGuard)
  async getTags(@Query() param: GetTagsParams): Promise<GetTagsRes> {
    return this.groupService.getTags(param);
  }

  // /**
  //  * @description 모임 참여
  //  *
  //  * TODO: 결제 시스템 연동
  //  */
  // @Post(':groupId/join')
  // @ApiBearerAuth('jwt')
  // @UseGuards(AtkGuard)
  // async joinGroup(@GetUser() user: User, @Param('groupId') groupId: string) {
  //   return this.groupService.joinGroup(user, groupId);
  // }
}
