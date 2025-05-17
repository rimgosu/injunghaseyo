import { ProofComment } from '@prisma/client';
import { ProofCommentItem } from './core/get-comments-res.dto';
import { UserWithPhoto } from '@/group/utils/types';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { BaseResDto } from '@/common/base-res.dto';

export class CreateCommentResDto extends IntersectionType(
  ProofCommentItem,
  PickType(BaseResDto, ['canMutation']),
) {
  constructor(proofComment: ProofComment, user: UserWithPhoto) {
    super();
    this.childCommentCount = 0;
    this.contents = proofComment.contents;
    this.createdAt = proofComment.createdAt;
    this.id = proofComment.id;
    this.isLiked = false;
    this.isDisliked = false;
    this.likeCount = 0;
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
