import { ProofCommentItem } from '@rimgosu/libs';
import { useProofHook } from '../hooks/useProofHook';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const Comments = () => {
  const { proofId } = useParams();
  const { getComments } = useProofHook();
  const [comments, setComments] = useState<ProofCommentItem[] | null>(null);

  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

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

  return <div>{comments?.map((c) => <div key={c.id}>{c.contents}</div>)}</div>;
};
