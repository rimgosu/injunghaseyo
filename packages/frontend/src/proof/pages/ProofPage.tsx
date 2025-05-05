import { useNavigate, useParams } from 'react-router-dom';
import { useProofHook } from '../hooks/useProofHook';
import { useEffect, useState } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { XButton } from '../../common/components/XButton';
import { GetProofRes, TypeEnum } from '@rimgosu/libs';
import {
  ChatBubbleBottomCenterIcon,
  FlagIcon,
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

export const ProofPage = () => {
  const { getProof, interactionProof } = useProofHook();
  const { proofId } = useParams();
  const [proof, setProof] = useState<GetProofRes | null>(null);
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
      rightElement={<XButton textColor="text-white" />}
      padding=""
      bgColor="bg-gray-900"
      height="h-screen"
    >
      <main className="bg-black flex justify-center items-center h-screen">
        <img src={proof?.url} />
        <section className="absolute bottom-4 right-4 flex flex-col gap-4">
          <LikeDisLikeButton
            isActive={proof?.isLiked ?? false}
            count={proof?.like}
            onClick={() =>
              handleInteraction(TypeEnum.LIKE, proof?.proofId as number)
            }
            ActiveIcon={HandThumbUpIconSolid}
            InactiveIcon={HandThumbUpIconOutline}
            iconClassName="w-8 h-8 text-white cursor-pointer"
          />
          <LikeDisLikeButton
            isActive={proof?.isDisliked ?? false}
            onClick={() =>
              handleInteraction(TypeEnum.DISLIKE, proof?.proofId as number)
            }
            ActiveIcon={HandThumbDownIconSolid}
            InactiveIcon={HandThumbDownIconOutline}
            iconClassName="w-8 h-8 text-white cursor-pointer"
            showCount={false}
          />
          <div className="flex items-center flex-col">
            <ChatBubbleBottomCenterIcon className="w-8 h-8 text-white" />
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
            <span className="text-white text-md">@{proof?.user.nickname}</span>
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
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </BaseLayout>
  );
};
