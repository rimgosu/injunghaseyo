import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { GetOptionalUser, GetUser } from '@/common/get-user.decorator';
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
  UploadProofLocationQuery,
  UploadProofParam,
  UploadProofQuery,
} from './dtos/upload-proof-param.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetTodayRewardParam } from './dtos/get-today-reward-param.dto';
import { GetTodayRewardRes } from './dtos/get-today-reward-res.dto';
import { CreateGroupBody } from './dtos/create-group-body.dto';
import { ValidateCreateGroupElementBody } from './dtos/validate-create-group-elem-query.dto';
import { GetGroupsQueryDto } from './dtos/get-groups-query.dto';
import { UploadProofRes } from './dtos/upload-proof-res.dto';
import { GetGalleryParam } from './dtos/get-gallery-param.dto';
import { GetGalleryRes } from './dtos/get-gallery-res.dto';
import { getFileValidationPipe } from '@/common/files';
import { UpdateGroupQuery } from './dtos/update-group-query.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  /**
   * @description 그룹 생성
   */
  @Post()
  @ApiBearerAuth('jwt')
  @UseGuards(AtkGuard)
  async createGroup(
    @GetUser() user: User,
    @Query() params: CreateGroupParams,
    @Body() body: CreateGroupBody,
  ) {
    return this.groupService.createGroup(user, params, body);
  }

  /**
   * @description 그룹 수정
   */
  @Put(':groupId')
  @ApiBearerAuth('jwt')
  @UseGuards(AtkGuard)
  @UseInterceptors(FileInterceptor('groupPhoto'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: false,
    schema: {
      type: 'object',
      properties: {
        groupPhoto: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updateGroup(
    @GetUser() user: User,
    @Param('groupId') groupId: number,
    @Query() query: UpdateGroupQuery,
    @UploadedFile(getFileValidationPipe({ fileIsRequired: false }))
    groupPhoto?: Express.Multer.File,
  ) {
    return await this.groupService.updateGroup(
      user,
      query,
      groupId,
      groupPhoto,
    );
  }

  /**
   * @description 그룹 생성 요소 검증
   */
  @Post('validate-element')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: '그룹 생성 요소 검증',
  })
  @ApiBody({
    type: ValidateCreateGroupElementBody,
    examples: ValidateCreateGroupElementBody.examples,
  })
  async validateCreateGroupElement(
    @Body() body: ValidateCreateGroupElementBody,
    @GetUser() user: User,
  ) {
    return await this.groupService.validateCreateGroupElement(body, user);
  }

  /**
   * @description 태그 검색 - 자동완성
   */
  @Get('tags')
  @ApiBearerAuth('jwt')
  @UseGuards(AtkGuard)
  @ApiResponse({
    status: 200,
    description: '태그 검색 - 자동완성',
    type: GetTagsRes,
  })
  async getTags(@Query() param: GetTagsParams): Promise<GetTagsRes> {
    return this.groupService.getTags(param);
  }

  /**
   * @description 모임 참여
   *
   * - 모임 진행 중간에 참여 시 남은일 수 만큼의 가격이 책정된다.
   * - 중간에 참여할 경우 다음 날부터 인증을 할 수 있다.
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
    status: 200,
    description: '모임 전체 조회',
    type: GetGroupsRes,
  })
  async getGroups(
    @GetOptionalUser() user: User | undefined,
    @Query() query: GetGroupsQueryDto,
  ): Promise<GetGroupsRes> {
    return this.groupService.getGroups(user, query);
  }

  /**
   * @description 모임 상세 조회
   */
  @Get(':groupId')
  @UseGuards(AtkOptionalGuard)
  @ApiResponse({
    status: 200,
    description: '모임 상세 조회',
    type: GetGroupRes,
  })
  async getGroup(
    @Param() param: GetGroupParam,
    @GetOptionalUser() user: User | undefined,
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
    status: 200,
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
  @Post(':groupId/proof/photo')
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
  @ApiResponse({
    status: 200,
    description: '인증 사진 업로드',
    type: UploadProofRes,
  })
  async uploadProofPhoto(
    @Param() param: UploadProofParam,
    @Query() query: UploadProofQuery,
    @GetUser() user: User,
    @UploadedFile(getFileValidationPipe({ fileIsRequired: true }))
    proofPhoto: Express.Multer.File,
  ) {
    return this.groupService.uploadProofPhoto(param, query, proofPhoto, user);
  }

  /**
   * @description 인증 버튼 클릭
   */
  @Post(':groupId/proof/button')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  @ApiResponse({
    status: 200,
    description: '인증 버튼 클릭',
    type: UploadProofRes,
  })
  async uploadProofButton(
    @Param() param: UploadProofParam,
    @Query() query: UploadProofQuery,
    @GetUser() user: User,
  ) {
    return this.groupService.uploadProofButton(param, query, user);
  }

  /**
   * @description 현재 위치 확인
   */
  @Post(':groupId/proof/location')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  @ApiResponse({
    status: 200,
    description: '현재 위치 확인',
    type: UploadProofRes,
  })
  async uploadProofLocation(
    @Param() param: UploadProofParam,
    @Query() query: UploadProofLocationQuery,
    @GetUser() user: User,
  ) {
    return this.groupService.uploadProofLocation(param, query, user);
  }

  /**
   * @description 총 받을 금액 조회
   *
   * 일일 단위로 정산하는 방식
   *   - DAILY_PRICE: 모임 가격 / 총 진행일 수 (예: 30,000원/30일 = 1,000원/일)
   *   - DAILY_POOL: 해당 일자의 전체 참여자들이 낸 금액 * NET(0.8)
   *   - MY_DAILY_REWARD: 특정 날짜에 인증 성공한 사람들끼리 DAILY_POOL 균등 분배
   *   - MY_TOTAL_REWARD: ∑(MY_DAILY_REWARD)
   */
  @Get(':groupId/today-reward')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  @ApiResponse({
    status: 200,
    description: '오늘의 인증 보상 조회',
    type: GetTodayRewardRes,
  })
  async getTodayReward(
    @Param() param: GetTodayRewardParam,
    @GetUser() user: User,
  ): Promise<GetTodayRewardRes> {
    return this.groupService.getTodayReward(param, user);
  }

  /**
   * @description 모임 갤러리 조회
   *
   * 일별로 유저들이 한 인증을 조회한다.
   */
  @Get(':groupId/gallery')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  @ApiResponse({
    status: 200,
    description: '모임 갤러리 조회',
    type: [GetGalleryRes],
  })
  async getGallery(@Param() param: GetGalleryParam): Promise<GetGalleryRes[]> {
    return this.groupService.getGallery(param);
  }
}
