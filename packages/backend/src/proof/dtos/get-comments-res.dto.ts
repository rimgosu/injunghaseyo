import { BaseCursorPaginationResDto } from '@/common/base-cursor-pagination-res.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ProofCommentWithInteraction } from '../utils/types';
import { InteractionType } from '@prisma/client';

class UserForComment {
  @ApiProperty({
    description: '유저 id',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '유저 닉네임',
    example: '홍길동',
    type: String,
  })
  nickname: string;

  @ApiProperty({
    description: '유저 프로필 이미지',
    example: 'https://example.com/profile.jpg',
    type: String,
  })
  profilePhotoUrl: string;
}

class ProofCommentItem {
  @ApiProperty({
    description: '댓글 id',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '댓글 내용',
    example: '댓글 내용',
    type: String,
  })
  contents: string;

  @ApiProperty({
    description: '대댓글 갯수',
    example: 5,
    type: Number,
  })
  childCommentCount: number;

  @ApiProperty({
    description: '댓글 작성 시간',
    example: '2021-01-01T12:00:00Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: '댓글 수정 시간',
    example: '2021-01-01T12:00:00Z',
    type: Date,
  })
  updatedAt: Date;

  @ApiProperty({
    description: '내가 좋아요 했는지 여부',
    example: true,
    type: Boolean,
  })
  isLiked: boolean = false;

  @ApiProperty({
    description: '내가 싫어요 했는지 여부',
    example: false,
    type: Boolean,
  })
  isDisliked: boolean = false;

  @ApiProperty({
    description: '댓글 좋아요 수',
    example: 10,
    type: Number,
  })
  likeCount: number;

  @ApiProperty({
    description: '댓글 작성자',
    type: UserForComment,
  })
  user: UserForComment;

  constructor(item: ProofCommentWithInteraction) {
    this.id = item.id;
    this.contents = item.contents;
    this.childCommentCount = item._count.replies;
    this.createdAt = item.createdAt;
    this.updatedAt = item.updatedAt;
    if (item.commentInteraction && item.commentInteraction.length > 0) {
      this.isLiked = item.commentInteraction.some(
        (interaction) => interaction.type === InteractionType.LIKE,
      );
      this.isDisliked = item.commentInteraction.some(
        (interaction) => interaction.type === InteractionType.DISLIKE,
      );
    }
    this.user = {
      id: item.userId,
      nickname: item.user.nickname,
      profilePhotoUrl: item.user.profilePhoto.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )[0].url,
    };
  }
}

export class GetCommentsResDto extends BaseCursorPaginationResDto<ProofCommentItem> {
  @ApiProperty({
    description: '댓글 목록',
    type: [ProofCommentItem],
  })
  items: ProofCommentItem[];

  constructor(
    items: ProofCommentWithInteraction[],
    hasNextPage: boolean,
    nextCursor: number,
  ) {
    const proofCommentItems = items.map((item) => {
      return new ProofCommentItem(item);
    });

    super(proofCommentItems, hasNextPage, nextCursor);
  }
}
