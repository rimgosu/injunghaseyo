import { useState, useEffect, useRef } from 'react';
import { useCheckSignInStore } from '../../../auth/stores/useCheckSignInStore';
import { useProofHook } from '../../hooks/useProofHook';
import { useParams } from 'react-router-dom';
import { useCommentStore } from '../../stores/useCommentStore';
import { useProofStore } from '../../stores/useProofStore';
import { useReplyStore } from '../../stores/useReplyStore';

type TCommentInputBoxProps = {
  mode?: 'reply' | 'comment' | 'reply-to-reply';
  commentId?: number;
  parentCommentId?: number;
  nickname?: string;
  onComplete?: () => void;
  isFocused?: boolean;
};

export const CommentInputBox = ({
  mode = 'comment',
  commentId,
  parentCommentId,
  nickname,
  onComplete,
  isFocused = false,
}: TCommentInputBoxProps) => {
  const { proofId } = useParams();
  const [focused, setFocused] = useState<boolean>(isFocused);
  const { checkSignInRes } = useCheckSignInStore();
  const { createComment } = useProofHook();
  const { proof, setProof } = useProofStore(Number(proofId));
  const replyStore = parentCommentId
    ? useReplyStore(parentCommentId)
    : commentId
      ? useReplyStore(commentId)
      : null;
  const { comments, setComments } = useCommentStore(Number(proofId));
  const [contents, setContents] = useState<string>(
    nickname ? `@${nickname} ` : '',
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [contents]);

  const handleCreateComment = async () => {
    const res = await createComment(
      {
        proofId: Number(proofId),
        parentCommentId:
          mode === 'reply-to-reply'
            ? parentCommentId
            : mode === 'reply'
              ? commentId
              : undefined,
      },
      { contents },
    );

    if (res.data) {
      if (replyStore) {
        const { setReplies, replies, hasNextPage } = replyStore;
        !hasNextPage && setReplies([...replies, res.data]);
        comments.map((c) => {
          if ([parentCommentId, commentId].includes(c.id)) {
            c.childCommentCount = c.childCommentCount + 1;
          }
        });
      } else {
        setComments([res.data, ...comments]);
      }
      proof &&
        setProof({
          ...proof,
          commentCount: proof?.commentCount + 1,
        });
    }

    setContents('');
    setFocused(false);
    onComplete && onComplete();
  };

  const pressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        handleCreateComment();
      }
    }
  };

  return (
    <div
      className={`flex justify-center gap-2 border-gray-300 ${mode === 'comment' && 'items-center border-t px-4 py-3'}`}
    >
      <img
        src={checkSignInRes.profilePhoto}
        className={`h-12 w-12 rounded-full border border-gray-400 ${['reply', 'reply-to-reply'].includes(mode) && 'h-9 w-9'}`}
      />
      <div className="flex flex-1 flex-col gap-2">
        <textarea
          ref={textareaRef}
          className="text-md box-border max-h-[120px] min-h-[24px] w-full resize-none border-b border-gray-400 scrollbar-hide focus:border-black focus:outline-none"
          onFocus={() => setFocused(true)}
          placeholder={
            !focused && mode === 'comment'
              ? '댓글 추가..'
              : !focused && mode === 'reply'
                ? '답글 추가..'
                : ''
          }
          value={contents}
          onChange={(e) => {
            setContents(e.target.value);
          }}
          onKeyDown={pressEnter}
          rows={1}
        />
        {(focused || contents.length > 0) && (
          <div
            className={`flex justify-end gap-2 ${['reply', 'reply-to-reply'].includes(mode) && 'text-md'} ${mode === 'comment' && 'text-lg'}`}
          >
            <p
              className={`cursor-pointer rounded-3xl text-gray-500 hover:bg-gray-100 ${['reply', 'reply-to-reply'].includes(mode) && 'p-1 px-3'} ${mode === 'comment' && 'p-2 px-4'}`}
              onClick={() => {
                setFocused(false);
                setContents('');
                isFocused && onComplete && onComplete();
              }}
            >
              취소
            </p>
            <p
              className={`cursor-pointer rounded-3xl bg-gray-300 text-gray-500 ${contents.length > 0 && 'bg-green-400 font-bold text-white'} ${['reply', 'reply-to-reply'].includes(mode) && 'p-1 px-3'} ${mode === 'comment' && 'p-2 px-4'}`}
              onClick={handleCreateComment}
            >
              댓글
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
