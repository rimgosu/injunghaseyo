import { ProofComment } from '@prisma/client';
import { ProofCommentItem } from './core/get-comments-res.dto';
import { UserWithPhoto } from '@/group/utils/types';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { BaseResDto } from '@/common/base-res.dto';

export class CreateCommentResDto extends IntersectionType(
  ProofCommentItem,
  PickType(BaseResDto, ['canMutation']),
) {
  @ApiProperty({
    description: '댓글 부모 아이디',
    example: 1,
    type: Number,
    nullable: true,
  })
  parentId: number | null;

  constructor(proofComment: ProofComment, user: UserWithPhoto) {
    super();
    this.childCommentCount = 0;
    this.contents = proofComment.contents;
    this.createdAt = proofComment.createdAt;
    this.id = proofComment.id;
    this.isLiked = false;
    this.isDisliked = false;
    this.likeCount = 0;
    this.parentId = proofComment.parentId || null;
    this.user = {
      id: user.id,
      nickname: user.nickname,
      profilePhotoUrl: user.profilePhoto.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )[0].url,
    };
    this.canMutation = true;
  }
}
