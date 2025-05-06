import { useState, useEffect, useRef } from 'react';
import { useCheckSignInStore } from '../../../auth/stores/useCheckSignInStore';
import { useProofHook } from '../../hooks/useProofHook';
import { useParams } from 'react-router-dom';

export const CommentInputBox = () => {
  const [focused, setFocused] = useState<boolean>(false);
  const { checkSignInRes } = useCheckSignInStore();
  const { createComment, getComments } = useProofHook();
  const [contents, setContents] = useState<string>('');
  const { proofId } = useParams();
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
    await createComment({ proofId: Number(proofId) }, { contents });
    await getComments({ proofId: Number(proofId) });
    setContents('');
    setFocused(false);
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
    <div className="flex items-center justify-center gap-2 border-t border-gray-300 py-2 px-4">
      <img
        src={checkSignInRes.profilePhoto}
        className="w-12 h-12 rounded-full border border-gray-400"
      />
      <div className="flex-1 flex flex-col gap-2">
        <textarea
          ref={textareaRef}
          className="w-full border-b border-gray-400 focus:outline-none focus:border-black text-md resize-none min-h-[24px] max-h-[120px] box-border scrollbar-hide"
          onFocus={() => setFocused(true)}
          placeholder={!focused ? '댓글 추가..' : ''}
          value={contents}
          onChange={(e) => {
            setContents(e.target.value);
          }}
          onKeyDown={pressEnter}
          rows={1}
        />
        {focused && (
          <div className="flex justify-end gap-2 text-lg">
            <p
              className="text-gray-500 hover:bg-gray-100 p-2 px-4 rounded-3xl cursor-pointer"
              onClick={() => {
                setFocused(false);
                setContents('');
              }}
            >
              취소
            </p>
            <p
              className={`text-gray-500 bg-gray-300 p-2 px-4 rounded-3xl cursor-pointer ${contents.length > 0 && 'bg-green-400 text-white font-bold'}`}
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
