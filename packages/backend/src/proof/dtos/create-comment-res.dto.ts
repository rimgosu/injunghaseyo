import { ProofComment } from '@prisma/client';
import { ProofCommentItem } from './core/get-comments-res.dto';
import { UserWithPhoto } from '@/group/utils/types';
import { IntersectionType } from '@nestjs/swagger';

/**
 * ProofCommentItem의 constructor를 사용하고 싶지 않아 IntersectionType을 사용함
 */
export class CreateCommentResDto extends IntersectionType(ProofCommentItem) {
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
  }
}
