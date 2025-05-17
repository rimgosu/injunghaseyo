import { ProofCommentItem, ProofReplyItem, TypeEnum1 } from '@rimgosu/libs';
import { useNavigate, useParams } from 'react-router-dom';
import { LikeDisLikeButton } from '../core/LikeDisLikeButton';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
  HandThumbDownIcon as HandThumbDownIconOutline,
  HandThumbUpIcon as HandThumbUpIconOutline,
  PencilIcon,
  TrashIcon,
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
import { ReplyElement } from './ReplyElement';
import { useReplyStore } from '../../stores/useReplyStore';

type TProofCommentElementProps = {
  item: ProofCommentItem | ProofReplyItem;
  mode?: 'comment' | 'reply';
  parentCommentId?: number;
};

export const CommentElement = ({
  item,
  parentCommentId,
  mode = 'comment',
}: TProofCommentElementProps) => {
  const navigate = useNavigate();
  const { interactionComment, deleteComment } = useProofHook();
  const { proofId } = useParams();
  const { setComments, comments } = useCommentStore(Number(proofId));
  const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const replyStore = parentCommentId ? useReplyStore(parentCommentId) : null;
  const [isEllipsisOpen, setIsEllipsisOpen] = useState<boolean>(false);

  const handleInteraction = async (type: TypeEnum1) => {
    await interactionComment({
      commentId: item.id,
      proofId: Number(proofId),
      type,
    });

    const updateInteraction = (
      targetItem: ProofCommentItem | ProofReplyItem,
      type: TypeEnum1,
    ) => {
      // 같은 타입을 다시 클릭한 경우 (삭제)
      if (
        (type === TypeEnum1.LIKE && targetItem.isLiked) ||
        (type === TypeEnum1.DISLIKE && targetItem.isDisliked)
      ) {
        return {
          ...targetItem,
          isLiked: false,
          isDisliked: false,
          likeCount:
            type === TypeEnum1.LIKE
              ? targetItem.likeCount - 1
              : targetItem.likeCount,
        };
      }

      // 다른 타입으로 변경하는 경우
      if (
        (type === TypeEnum1.LIKE && targetItem.isDisliked) ||
        (type === TypeEnum1.DISLIKE && targetItem.isLiked)
      ) {
        return {
          ...targetItem,
          isLiked: type === TypeEnum1.LIKE,
          isDisliked: type === TypeEnum1.DISLIKE,
          likeCount:
            type === TypeEnum1.LIKE
              ? targetItem.likeCount + 1
              : targetItem.likeCount - 1,
        };
      }

      // 처음 인터랙션 하는 경우
      return {
        ...targetItem,
        isLiked: type === TypeEnum1.LIKE,
        isDisliked: type === TypeEnum1.DISLIKE,
        likeCount:
          type === TypeEnum1.LIKE
            ? targetItem.likeCount + 1
            : targetItem.likeCount,
      };
    };

    if (mode === 'comment') {
      setComments(
        comments.map((c) => {
          if (c.id !== item.id) return c;
          return updateInteraction(c, type) as ProofCommentItem;
        }),
      );
    }

    if (mode === 'reply' && replyStore) {
      const { setReplies, replies } = replyStore;
      setReplies(
        replies.map((r) => {
          if (r.id !== item.id) return r;
          return updateInteraction(r, type) as ProofReplyItem;
        }),
      );
    }
  };

  const handleDeleteComment = async () => {
    const res = await deleteComment(Number(proofId), item.id);

    if (res.data) {
      setComments(comments.filter((c) => c.id !== res.data.id)); // 삭제 후 업데이트
    }
  };

  return (
    <article key={item.id} className="relative flex gap-4">
      <img
        src={item.user.profilePhotoUrl}
        alt="profile"
        className={`h-12 w-12 cursor-pointer rounded-full ${
          mode === 'reply' && 'h-9 w-9'
        }`}
        onClick={() => {
          navigate(`/user/${item.user.id}/profile`);
        }}
      />
      <div className="flex w-full flex-col gap-1">
        <div className="flex gap-2 text-sm">
          <span className="font-bold">@{item.user.nickname}</span>
          <span className="text-gray-500">
            {getRelativeTime(item.createdAt)} 전
          </span>
        </div>
        <div className="whitespace-pre-wrap text-sm">{item.contents}</div>
        <div className="flex items-center gap-2">
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
            className="ml-1 cursor-pointer rounded-2xl px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => {
              setIsReplyInputOpen(!isReplyInputOpen);
            }}
          >
            답글
          </p>
        </div>
        {'childCommentCount' in item && item.childCommentCount > 0 && (
          <div
            className="flex w-fit cursor-pointer items-center gap-1 rounded-2xl px-3 py-2 text-gray-700 hover:bg-green-100"
            onClick={() => {
              setIsReplyOpen(!isReplyOpen);
            }}
          >
            <p>답글</p>
            <p>{item.childCommentCount}개</p>
            {isReplyOpen ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </div>
        )}
        {isReplyInputOpen && (
          <CommentInputBox
            mode={mode === 'reply' ? 'reply-to-reply' : 'reply'}
            commentId={item.id}
            parentCommentId={parentCommentId}
            nickname={mode === 'reply' ? item.user.nickname : undefined}
            onComplete={() => {
              setIsReplyInputOpen(false);
              setIsReplyOpen(true);
            }}
            isFocused={true}
          />
        )}
        {isReplyOpen && <ReplyElement parentCommentId={item.id} />}
      </div>
      {item.canMutation && (
        <div className="absolute right-0 top-0">
          <div className="relative">
            <EllipsisVerticalIcon
              className="h-7 w-7 cursor-pointer text-gray-500"
              onClick={() => {
                setIsEllipsisOpen(!isEllipsisOpen);
              }}
            />
            {isEllipsisOpen && (
              <div className="absolute right-0 mt-1 flex flex-col gap-2 rounded-2xl bg-white p-2 drop-shadow-lg">
                <div className="flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-4 py-2 hover:bg-gray-100">
                  <PencilIcon className="h-5 w-5 text-gray-500" />
                  <p className="cursor-pointer whitespace-nowrap rounded-2xl px-2 py-1">
                    수정
                  </p>
                </div>
                <div
                  className="flex cursor-pointer items-center justify-center gap-1 rounded-2xl p-2 hover:bg-gray-100"
                  onClick={handleDeleteComment}
                >
                  <TrashIcon className="h-5 w-5 text-gray-500" />
                  <p className="cursor-pointer whitespace-nowrap rounded-2xl px-2 py-1">
                    삭제
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
};
