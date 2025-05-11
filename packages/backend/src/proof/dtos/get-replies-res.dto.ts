import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ProofCommentItem } from './core/get-comments-res.dto';
import { BaseCursorPaginationResDto } from '@/common/base-cursor-pagination-res.dto';
import { ProofCommentWithInteraction } from '../utils/types';
import { InteractionType, User } from '@prisma/client';

class ProofReplyItem extends OmitType(ProofCommentItem, ['childCommentCount']) {
  constructor(item: ProofCommentWithInteraction, user?: User) {
    super();
    this.id = item.id;
    this.contents = item.contents;
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
    this.likeCount = item._count.commentInteraction;
    this.user = {
      id: item.userId,
      nickname: item.user.nickname,
      profilePhotoUrl: item.user.profilePhoto.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )[0].url,
    };
    this.canMutation = user?.id === item.user.id;
  }
}

export class GetRepliesResDto extends BaseCursorPaginationResDto<ProofReplyItem> {
  @ApiProperty({
    description: '대댓글 목록',
    type: [ProofReplyItem],
  })
  items: ProofReplyItem[];

  constructor(
    items: ProofCommentWithInteraction[],
    hasNextPage: boolean,
    nextCursor: number,
    user?: User,
  ) {
    const proofReplyItems = items.map((item) => {
      return new ProofReplyItem(item, user);
    });

    super(proofReplyItems, hasNextPage, nextCursor);
  }
}
