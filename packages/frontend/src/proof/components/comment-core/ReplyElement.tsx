import { useParams } from 'react-router-dom';
import { useProofHook } from '../../hooks/useProofHook';
import { useEffect } from 'react';
import { useReplyStore } from '../../stores/useReplyStore';
import { CommentElement } from './CommentElement';
import { ArrowTurnDownRightIcon } from '@heroicons/react/24/outline';

type TReplyElementProps = {
  parentCommentId: number;
};

export const ReplyElement = ({ parentCommentId }: TReplyElementProps) => {
  const { proofId } = useParams();
  const { getReplies } = useProofHook();
  const {
    replies,
    setReplies,
    cursor,
    setCursor,
    hasNextPage,
    setHasNextPage,
  } = useReplyStore(parentCommentId);

  const handleGetReplies = async () => {
    const res = await getReplies({
      commentId: parentCommentId,
      proofId: Number(proofId),
      take: 5,
      cursor,
    });

    if (res.data) {
      setReplies([...replies, ...res.data.items]);
      setCursor(res.data.nextCursor);
      setHasNextPage(res.data.hasNextPage);
    }
  };

  useEffect(() => {
    if (replies.length === 0) {
      handleGetReplies();
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {replies.map((reply) => (
        <CommentElement
          key={reply.id}
          item={reply}
          mode="reply"
          parentCommentId={parentCommentId}
        />
      ))}
      {hasNextPage && (
        <div className="flex w-fit cursor-pointer items-center gap-2 rounded-2xl px-4 py-3 hover:bg-gray-300">
          <ArrowTurnDownRightIcon className="h-6 w-6" />
          <button onClick={handleGetReplies}>더보기</button>
        </div>
      )}
    </div>
  );
};
