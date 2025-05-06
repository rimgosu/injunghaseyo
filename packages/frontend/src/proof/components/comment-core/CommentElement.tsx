import { ProofCommentItem } from '@rimgosu/libs';
import { useNavigate } from 'react-router-dom';
import { LikeDisLikeButton } from '../core/LikeDisLikeButton';
import {
  HandThumbDownIcon as HandThumbDownIconOutline,
  HandThumbUpIcon as HandThumbUpIconOutline,
} from '@heroicons/react/24/outline';
import {
  HandThumbDownIcon as HandThumbDownIconSolid,
  HandThumbUpIcon as HandThumbUpIconSolid,
} from '@heroicons/react/24/solid';
import { useProofHook } from '../../hooks/useProofHook';

type TProofCommentElementProps = {
  item: ProofCommentItem;
};

export const CommentElement = ({ item }: TProofCommentElementProps) => {
  const navigate = useNavigate();
  const { createComment } = useProofHook();

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
      <div className="flex flex-col gap-1">
        <div className="text-sm flex gap-2">
          <span className="font-bold">@{item.user.nickname}</span>
          <span className="text-gray-500">{item.createdAt}</span>
        </div>
        <div className="text-sm">{item.contents}</div>
        <div className="flex gap-2">
          <LikeDisLikeButton
            isActive={item.isLiked}
            count={item.likeCount}
            onClick={() => {
              console.log('like');
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
              console.log('dislike');
            }}
            ActiveIcon={HandThumbDownIconSolid}
            InactiveIcon={HandThumbDownIconOutline}
            iconClassName="w-5 h-5 text-gray-700 cursor-pointer drop-shadow-lg"
            countIconClassName="text-gray-700 ml-1"
            showCount={false}
            flexDirection="flex-row"
          />
          <p className="text-gray-700 ml-1 cursor-pointer">답글</p>
        </div>
      </div>
    </article>
  );
};
