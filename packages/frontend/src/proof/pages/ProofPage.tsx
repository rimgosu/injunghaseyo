import { useNavigate, useParams } from 'react-router-dom';
import { useProofHook } from '../hooks/useProofHook';
import { useEffect, useState } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { XButton } from '../../common/components/XButton';
import { GetProofRes, TypeEnum } from '@rimgosu/libs';
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
import LikeDisLikeButton from '../components/LikeDisLikeButton';
import { ReportModal } from '../components/ReportModal';
import { Comments } from '../components/Comments';
import { CommentBox } from '../components/core/CommentBox';

type ProofMode = 'view' | 'comment';

export const ProofPage = () => {
  const { getProof, interactionProof } = useProofHook();
  const { proofId } = useParams();
  const [proof, setProof] = useState<GetProofRes | null>(null);
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
      height="h-screen"
    >
      {proofMode === 'view' && (
        <main className="bg-black flex justify-center items-center h-screen">
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
            <div className="flex items-center flex-col">
              <ChatBubbleBottomCenterIcon
                className="w-8 h-8 text-white cursor-pointer"
                onClick={() => setProofMode('comment')}
              />
              <span className="text-white">{proof?.commentCount}</span>
            </div>
            <div
              className="flex items-center flex-col cursor-pointer"
              onClick={() => setIsReportModalOpen(true)}
            >
              <FlagIcon className="w-8 h-8 text-white" />
            </div>
          </section>
          <section className="absolute bottom-4 left-4 flex flex-col gap-4">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                navigate(`/user/${proof?.user.userId}/profile`);
              }}
            >
              <img
                src={proof?.user.profilePhotoUrl}
                className="rounded-full w-12 h-12 "
              />
              <span className="text-white text-md">
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
        <main className="bg-black flex justify-center items-center h-screen flex-col">
          <section
            className="h-1/3 cursor-pointer"
            onClick={() => setProofMode('view')}
          >
            <img src={proof?.url} className="w-full h-full" />
          </section>
          <section className="bg-white w-full h-2/3 rounded-t-2xl p-6 shadow-2xl flex flex-col gap-12">
            <header className="flex justify-between">
              <div className="text-xl">댓글</div>
              <XMarkIcon
                className="w-6 h-6 text-black cursor-pointer"
                onClick={() => setProofMode('view')}
              />
            </header>
            <div className="flex flex-col gap-8">
              <Comments />
            </div>
          </section>
          <section className="w-full flex flex-col p-4 bg-white gap-2">
            <CommentBox />
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
