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
  const replyStore = commentId ? useReplyStore(commentId) : null;
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

    console.log('res:', res.data);
    console.log('replyStore:', replyStore?.replies);
    console.log('comments:', comments);

    if (res.data) {
      if (replyStore) {
        const { setReplies, replies } = replyStore;
        setReplies([...replies, res.data]);
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
      className={`flex justify-center gap-2 border-gray-300 ${mode === 'comment' && 'border-t py-3 px-4 items-center'}`}
    >
      <img
        src={checkSignInRes.profilePhoto}
        className={`w-12 h-12 rounded-full border border-gray-400 ${mode === 'reply' && 'w-9 h-9'}`}
      />
      <div className="flex-1 flex flex-col gap-2">
        <textarea
          ref={textareaRef}
          className="w-full border-b border-gray-400 focus:outline-none focus:border-black text-md resize-none min-h-[24px] max-h-[120px] box-border scrollbar-hide"
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
            className={`flex justify-end gap-2 ${mode === 'reply' && 'text-md'} ${mode === 'comment' && 'text-lg'}`}
          >
            <p
              className={`text-gray-500 hover:bg-gray-100 rounded-3xl cursor-pointer ${mode === 'reply' && 'p-1 px-3'} ${mode === 'comment' && 'p-2 px-4'}`}
              onClick={() => {
                setFocused(false);
                setContents('');
                isFocused && onComplete && onComplete();
              }}
            >
              취소
            </p>
            <p
              className={`text-gray-500 bg-gray-300 rounded-3xl cursor-pointer ${contents.length > 0 && 'bg-green-400 text-white font-bold'} ${mode === 'reply' && 'p-1 px-3'} ${mode === 'comment' && 'p-2 px-4'}`}
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
