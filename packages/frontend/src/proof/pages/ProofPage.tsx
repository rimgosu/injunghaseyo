import { useNavigate, useParams } from 'react-router-dom';
import { useProofHook } from '../hooks/useProofHook';
import { useEffect, useState } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { XButton } from '../../common/components/XButton';
import { TypeEnum } from '@rimgosu/libs';
import {
  ChatBubbleBottomCenterIcon,
  FlagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  HandThumbDownIcon as HandThumbDownIconOutline,
  HandThumbUpIcon as HandThumbUpIconOutline,
} from '@heroicons/react/24/outline';
import {
  HandThumbDownIcon as HandThumbDownIconSolid,
  HandThumbUpIcon as HandThumbUpIconSolid,
} from '@heroicons/react/24/solid';
import { LikeDisLikeButton } from '../components/core/LikeDisLikeButton';
import { ReportModal } from '../components/ReportModal';
import { Comments } from '../components/Comments';
import { CommentInputBox } from '../components/comment-core/CommentInputBox';
import { useProofStore } from '../stores/useProofStore';

type ProofMode = 'view' | 'comment';

export const ProofPage = () => {
  const { getProof, interactionProof } = useProofHook();
  const { proofId } = useParams();
  const { proof, setProof } = useProofStore(Number(proofId));
  const [proofMode, setProofMode] = useState<ProofMode>('view');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const navigate = useNavigate();
  const fetchProof = async () => {
    const res = await getProof(Number(proofId));
    if (res.data) {
      setProof(res.data);
    }
  };

  const handleInteraction = async (type: TypeEnum, proofId: number) => {
    await interactionProof({
      type,
      proofId,
    });
    await fetchProof();
  };

  useEffect(() => {
    fetchProof();
  }, [proofId]);

  return (
    <BaseLayout
      rightElement={proofMode === 'view' && <XButton textColor="text-white" />}
      padding=""
      overflowY=""
      height="h-screen"
    >
      {proofMode === 'view' && (
        <main className="flex h-screen items-center justify-center bg-black">
          <img src={proof?.url} className="w-full" />
          <section className="absolute bottom-4 right-4 flex flex-col gap-4">
            <LikeDisLikeButton
              isActive={proof?.isLiked ?? false}
              count={proof?.like}
              onClick={() =>
                handleInteraction(TypeEnum.LIKE, proof?.proofId as number)
              }
              ActiveIcon={HandThumbUpIconSolid}
              InactiveIcon={HandThumbUpIconOutline}
              iconClassName="w-8 h-8 text-white cursor-pointer drop-shadow-lg"
            />
            <LikeDisLikeButton
              isActive={proof?.isDisliked ?? false}
              onClick={() =>
                handleInteraction(TypeEnum.DISLIKE, proof?.proofId as number)
              }
              ActiveIcon={HandThumbDownIconSolid}
              InactiveIcon={HandThumbDownIconOutline}
              iconClassName="w-8 h-8 text-white cursor-pointer drop-shadow-lg"
              showCount={false}
            />
            <div className="flex flex-col items-center">
              <ChatBubbleBottomCenterIcon
                className="h-8 w-8 cursor-pointer text-white"
                onClick={() => setProofMode('comment')}
              />
              <span className="text-white">{proof?.commentCount}</span>
            </div>
            <div
              className="flex cursor-pointer flex-col items-center"
              onClick={() => setIsReportModalOpen(true)}
            >
              <FlagIcon className="h-8 w-8 text-white" />
            </div>
          </section>
          <section className="absolute bottom-4 left-4 flex flex-col gap-4">
            <div
              className="flex cursor-pointer items-center gap-2"
              onClick={() => {
                navigate(`/user/${proof?.user.userId}/profile`);
              }}
            >
              <img
                src={proof?.user.profilePhotoUrl}
                className="h-12 w-12 rounded-full"
              />
              <span className="text-md text-white">
                @{proof?.user.nickname}
              </span>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                navigate(`/group/${proof?.group.groupId}`);
              }}
            >
              <span className="text-white">{proof?.group.title}</span>
            </div>
          </section>
        </main>
      )}
      {proofMode === 'comment' && (
        <main className="flex h-screen flex-col items-center justify-center bg-black">
          <section
            className="h-1/3 cursor-pointer"
            onClick={() => {
              setProofMode('view');
            }}
          >
            <img src={proof?.url} className="h-full w-full" />
          </section>
          <section className="flex h-2/3 w-full flex-col gap-2 border-t border-gray-500 bg-white p-6 shadow-2xl">
            <header className="flex justify-between">
              <div className="flex gap-2 text-xl">
                <p>댓글</p>
                <p>{proof?.commentCount}</p>
              </div>
              <XMarkIcon
                className="h-6 w-6 cursor-pointer text-black"
                onClick={() => {
                  setProofMode('view');
                }}
              />
            </header>
            <div className="flex flex-col gap-8 overflow-y-auto scrollbar-hide">
              <Comments />
            </div>
          </section>
          <section className="absolute bottom-0 flex w-full flex-col gap-2 bg-white">
            <CommentInputBox />
          </section>
        </main>
      )}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </BaseLayout>
  );
};
