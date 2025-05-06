import { ProofCommentItem, TypeEnum1 } from '@rimgosu/libs';
import { useNavigate, useParams } from 'react-router-dom';
import { LikeDisLikeButton } from '../core/LikeDisLikeButton';
import {
  ChevronDownIcon,
  HandThumbDownIcon as HandThumbDownIconOutline,
  HandThumbUpIcon as HandThumbUpIconOutline,
} from '@heroicons/react/24/outline';
import {
  HandThumbDownIcon as HandThumbDownIconSolid,
  HandThumbUpIcon as HandThumbUpIconSolid,
} from '@heroicons/react/24/solid';
import { useProofHook } from '../../hooks/useProofHook';
import { getRelativeTime } from '../../../common/common.util';
import { useCommentStore } from '../../stores/useCommentStore';
import { CommentInputBox } from './CommentInputBox';
import { useState } from 'react';

type TProofCommentElementProps = {
  item: ProofCommentItem;
};

export const CommentElement = ({ item }: TProofCommentElementProps) => {
  const navigate = useNavigate();
  const { interactionComment } = useProofHook();
  const { proofId } = useParams();
  const { setComments, comments } = useCommentStore();
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const handleInteraction = async (type: TypeEnum1) => {
    await interactionComment({
      commentId: item.id,
      proofId: Number(proofId),
      type,
    });
    setComments(
      comments.map((c) => {
        if (c.id !== item.id) return c;

        // 같은 타입을 다시 클릭한 경우 (삭제)
        if (
          (type === TypeEnum1.LIKE && c.isLiked) ||
          (type === TypeEnum1.DISLIKE && c.isDisliked)
        ) {
          return {
            ...c,
            isLiked: false,
            isDisliked: false,
            likeCount: type === TypeEnum1.LIKE ? c.likeCount - 1 : c.likeCount,
          };
        }

        // 다른 타입으로 변경하는 경우
        if (
          (type === TypeEnum1.LIKE && c.isDisliked) ||
          (type === TypeEnum1.DISLIKE && c.isLiked)
        ) {
          return {
            ...c,
            isLiked: type === TypeEnum1.LIKE,
            isDisliked: type === TypeEnum1.DISLIKE,
            likeCount:
              type === TypeEnum1.LIKE ? c.likeCount + 1 : c.likeCount - 1,
          };
        }

        // 처음 인터랙션 하는 경우
        return {
          ...c,
          isLiked: type === TypeEnum1.LIKE,
          isDisliked: type === TypeEnum1.DISLIKE,
          likeCount: type === TypeEnum1.LIKE ? c.likeCount + 1 : c.likeCount,
        };
      }),
    );
  };

  return (
    <article key={item.id} className="flex gap-4">
      <img
        src={item.user.profilePhotoUrl}
        alt="profile"
        className="w-12 h-12 rounded-full cursor-pointer"
        onClick={() => {
          navigate(`/user/${item.user.id}/profile`);
        }}
      />
      <div className="flex flex-col gap-1 w-full">
        <div className="text-sm flex gap-2">
          <span className="font-bold">@{item.user.nickname}</span>
          <span className="text-gray-500">
            {getRelativeTime(item.createdAt)} 전
          </span>
        </div>
        <div className="text-sm whitespace-pre-wrap">{item.contents}</div>
        <div className="flex gap-2 items-center">
          <LikeDisLikeButton
            isActive={item.isLiked}
            count={item.likeCount}
            onClick={() => {
              handleInteraction(TypeEnum1.LIKE);
            }}
            ActiveIcon={HandThumbUpIconSolid}
            InactiveIcon={HandThumbUpIconOutline}
            iconClassName="w-5 h-5 text-gray-700 cursor-pointer drop-shadow-lg"
            countIconClassName="text-gray-700 ml-1"
            flexDirection="flex-row"
          />
          <LikeDisLikeButton
            isActive={item.isDisliked}
            onClick={() => {
              handleInteraction(TypeEnum1.DISLIKE);
            }}
            ActiveIcon={HandThumbDownIconSolid}
            InactiveIcon={HandThumbDownIconOutline}
            iconClassName="w-5 h-5 text-gray-700 cursor-pointer drop-shadow-lg"
            countIconClassName="text-gray-700 ml-1"
            showCount={false}
            flexDirection="flex-row"
          />
          <p
            className="text-gray-700 ml-1 text-sm cursor-pointer hover:bg-gray-100 rounded-2xl py-3 px-4"
            onClick={() => {
              setIsReplyOpen(!isReplyOpen);
            }}
          >
            답글
          </p>
        </div>
        {item.childCommentCount > 0 && (
          <div className="flex gap-1 items-center text-gray-700 cursor-pointer hover:bg-green-100 px-3 py-2 rounded-2xl w-fit">
            <p>답글</p>
            <p>{item.childCommentCount}개</p>
            <ChevronDownIcon className="w-5 h-5" />
          </div>
        )}
        {isReplyOpen && (
          <CommentInputBox
            mode="reply"
            parentCommentId={item.id}
            onComplete={() => setIsReplyOpen(false)}
          />
        )}
      </div>
    </article>
  );
};
