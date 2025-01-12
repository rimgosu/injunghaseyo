import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {
  GetOptionalUser as GetUserOptional,
  GetUser,
} from '@/common/get-user.decorator';
import { User } from '@prisma/client';
import { CreateGroupParams } from './dtos/create-group-params.dto';
import { AtkGuard } from '@/auth/guards/atk.guard';
import { GetTagsParams } from './dtos/get-tags-param.dto';
import { GetTagsRes } from './dtos/get-tags-res.dto';
import { JoinGroupParam } from './dtos/join-group-param.dto';
import { AtkOptionalGuard } from '@/auth/guards/atk-optional.guard';
import { GetGroupsRes } from './dtos/get-groups-res.dto';
import { GetGroupParam } from './dtos/get-group-param.dto';
import { GetGroupRes } from './dtos/get-group-res.dto';

@Controller('groups')
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
  @ApiResponse({
    description: '태그 검색 - 자동완성',
    type: GetTagsRes,
  })
  async getTags(@Query() param: GetTagsParams): Promise<GetTagsRes> {
    return this.groupService.getTags(param);
  }

  /**
   * @description 모임 참여
   */
  @Post(':groupId/join')
  @ApiBearerAuth('jwt')
  @UseGuards(AtkGuard)
  async joinGroup(@GetUser() user: User, @Param() param: JoinGroupParam) {
    return this.groupService.joinGroup(user, param);
  }

  /**
   * @description 모임 전체 조회
   */
  @Get()
  @UseGuards(AtkOptionalGuard)
  @ApiResponse({
    description: '모임 전체 조회',
    type: GetGroupsRes,
  })
  async getGroups(
    @GetUserOptional() user: User | undefined,
  ): Promise<GetGroupsRes> {
    return this.groupService.getGroups(user);
  }

  /**
   * @description 모임 상세 조회
   */
  @Get(':groupId')
  @UseGuards(AtkOptionalGuard)
  @ApiResponse({
    description: '모임 상세 조회',
    type: GetGroupRes,
  })
  async getGroup(
    @Param() param: GetGroupParam,
    @GetUserOptional() user: User | undefined,
  ): Promise<GetGroupRes> {
    return this.groupService.getGroup(param, user);
  }
}
