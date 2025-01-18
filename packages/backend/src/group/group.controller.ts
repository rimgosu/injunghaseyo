import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GroupService } from './group.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
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
import { LeaveGroupParam } from './dtos/leave-group-param.dto';
import { GetTodayParam } from './dtos/get-today-params.dto';
import { GetTodayRes } from './dtos/get-today-res.dto';
import { GetTodayQuery } from './dtos/get-today-query.dto';
import {
  UploadProofParam,
  UploadProofQuery,
} from './dtos/upload-proof-param.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  /**
   * @description 모임 탈퇴
   *
   * - 모임 참여자 수가 1명 이하일 경우 모임 삭제
   * - 모임 참여자 수가 2명 이상일 경우 참여 및 모임 진행 삭제
   *
   * 환불 정책
   * - 모임 등록 1시간 이내면 무조건 환불
   * - 모임 시작 24시간 전 이전 환불 불가
   * - 모임 시작 24시간 전 이후 환불 가능
   */
  @Delete(':groupId/leave')
  @ApiBearerAuth('jwt')
  @UseGuards(AtkGuard)
  async leaveGroup(@GetUser() user: User, @Param() param: LeaveGroupParam) {
    return this.groupService.leaveGroup(user, param);
  }

  /**
   * @description 오늘의 인증 조회
   */
  @Get(':groupId/today')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  @ApiResponse({
    description: '오늘의 인증 조회',
    type: GetTodayRes,
  })
  async getToday(
    @Param() param: GetTodayParam,
    @Query() query: GetTodayQuery,
    @GetUser() user: User,
  ): Promise<GetTodayRes> {
    return this.groupService.getToday(param, user, query);
  }

  /**
   * @description 금일 인증 사진 업로드
   *
   * - 금일의 인증 사진 업로드
   */
  @Post(':groupId/upload')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  @UseInterceptors(FileInterceptor('proofPhoto'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        proofPhoto: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadProofPhoto(
    @Param() param: UploadProofParam,
    @Query() query: UploadProofQuery,
    @GetUser() user: User,
    @UploadedFile() proofPhoto: Express.Multer.File,
  ) {
    return this.groupService.uploadProofPhoto(param, query, proofPhoto, user);
  }
}
