import { useProofHook } from '../hooks/useProofHook';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCommentStore } from '../stores/useCommentStore';
import { CommentElement } from './comment-core/CommentElement';

export const Comments = () => {
  const { proofId } = useParams();
  const { getComments } = useProofHook();
  const {
    comments,
    setComments,
    cursor,
    setCursor,
    hasNextPage,
    setHasNextPage,
  } = useCommentStore();

  const fetchComments = async () => {
    const res = await getComments({
      proofId: Number(proofId),
      take: 15,
      cursor,
    });
    if (res.data) {
      if (comments) {
        setComments([...comments, ...res.data.items]);
      } else {
        setComments(res.data.items);
      }
      setCursor(res.data.nextCursor);
      setHasNextPage(res.data.hasNextPage);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="flex flex-col gap-6 mb-16 mt-8">
      {comments.map((c) => (
        <CommentElement item={c} />
      ))}
    </div>
  );
};
