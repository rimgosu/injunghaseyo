import { useNavigate, useParams } from 'react-router-dom';
import { useProofHook } from '../hooks/useProofHook';
import { useEffect, useState } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { XButton } from '../../common/components/XButton';
import { GetProofRes, TypeEnum } from '@rimgosu/libs';
import {
  ChatBubbleBottomCenterIcon,
  FlagIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';

export const ProofPage = () => {
  const { getProof, interactionProof } = useProofHook();
  const { proofId } = useParams();
  const [proof, setProof] = useState<GetProofRes | null>(null);
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
          <div className="flex items-center flex-col">
            <HandThumbUpIcon
              className="w-8 h-8 text-white cursor-pointer"
              onClick={() => {
                handleInteraction(TypeEnum.LIKE, proof?.proofId as number);
              }}
            />
            <span className="text-white">{proof?.like}</span>
          </div>
          <div className="flex items-center flex-col">
            <HandThumbDownIcon className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center flex-col">
            <ChatBubbleBottomCenterIcon className="w-8 h-8 text-white" />
            <span className="text-white">{proof?.commentCount}</span>
          </div>
          <div className="flex items-center flex-col">
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
    </BaseLayout>
  );
};
