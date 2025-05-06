import { useState } from 'react';
import { useCheckSignInStore } from '../../../auth/stores/useCheckSignInStore';
import { useProofHook } from '../../hooks/useProofHook';
import { useParams } from 'react-router-dom';

export const CommentBox = () => {
  const [focused, setFocused] = useState<boolean>(false);
  const { checkSignInRes } = useCheckSignInStore();
  const { createComment } = useProofHook();
  const [contents, setContents] = useState<string>('');
  const { proofId } = useParams();

  const handleCreateComment = async () => {
    await createComment({ proofId: Number(proofId) }, { contents });
    setContents('');
    setFocused(false);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <img
        src={checkSignInRes.profilePhoto}
        className="w-16 h-16 rounded-full border border-gray-400"
      />
      <div className="flex-1 flex flex-col gap-2">
        <input
          type="text"
          className="flex-1 w-full border-b border-gray-400 focus:outline-none focus:border-black text-lg"
          onFocus={() => setFocused(true)}
          placeholder={!focused ? '댓글 추가..' : ''}
          value={contents}
          onChange={(e) => setContents(e.target.value)}
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
