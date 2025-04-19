import { ApiProperty } from '@nestjs/swagger';
import { GroupStatus, JoinStatus } from '../utils/enums';
import { ProofMethodElem } from '../utils/types';

class Participant {
  @ApiProperty({
    description: '참여자 ID',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '참여자 사진',
    type: String,
  })
  profilePhoto: string;
}

class ParticipantForGallery extends Participant {
  @ApiProperty({
    description: '참여자 닉네임',
    type: Number,
    example: '홍길동',
  })
  nickname: string;
}

export class BaseGroupRes {
  @ApiProperty({
    description: '갤러리에 들어가는 참여자 정보',
    type: ParticipantForGallery,
  })
  participantForGallery: ParticipantForGallery;

  @ApiProperty({
    description: '그룹 사진',
    type: String,
  })
  groupPhoto: string;

  @ApiProperty({
    description: '그룹 ID',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '그룹 제목',
    type: String,
  })
  title: string;

  @ApiProperty({
    description: '그룹 가격',
    type: Number,
  })
  price: number;

  @ApiProperty({
    description: '그룹 설명',
    type: String,
  })
  description: string;

  @ApiProperty({
    description: '그룹 증명 방법',
    type: [ProofMethodElem],
  })
  proofMethods: ProofMethodElem[];

  @ApiProperty({
    description: '그룹 상태',
    enum: GroupStatus,
  })
  status: GroupStatus;

  @ApiProperty({
    description: '그룹 시작일',
    type: String,
  })
  startDate: string;

  @ApiProperty({
    description: '그룹 종료일',
    type: String,
  })
  endDate: string;

  @ApiProperty({
    description: '참여자 수',
    type: Number,
  })
  numberOfParticipants: number;

  @ApiProperty({
    description: '참여 상태',
    enum: JoinStatus,
  })
  joinStatus?: JoinStatus;

  @ApiProperty({
    description: '태그',
    type: [String],
  })
  tags: string[];

  @ApiProperty({
    description: '참여자 목록',
    type: [Participant],
  })
  participants: Participant[];

  @ApiProperty({
    description: '전체 인증 일정',
    type: [String],
  })
  groupDate: string[];

  @ApiProperty({
    description: '완료한 인증',
    type: [String],
  })
  completedDate: string[];

  @ApiProperty({
    description: '인증 사진',
    type: String,
    nullable: true,
  })
  proofPhoto: string | null;

  @ApiProperty({
    description: '인증 방법',
    type: ProofMethodElem,
  })
  proofMethod: ProofMethodElem;

  @ApiProperty({
    description: '모임 진행 id',
    type: Number,
  })
  groupProgressId: number;
}
