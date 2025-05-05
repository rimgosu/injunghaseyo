import { useParams } from 'react-router-dom';
import { useProofHook } from '../hooks/useProofHook';
import { useEffect, useState } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { XButton } from '../../common/components/XButton';
import { GetProofRes } from '@rimgosu/libs';
import {
  ChatBubbleBottomCenterIcon,
  FlagIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';

export const ProofPage = () => {
  const { getProof } = useProofHook();
  const { proofId } = useParams();
  const [proof, setProof] = useState<GetProofRes | null>(null);

  const fetchProof = async () => {
    const res = await getProof(Number(proofId));
    if (res.data) {
      setProof(res.data);
    }
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
      <div className="bg-black flex justify-center items-center h-screen">
        <img src={proof?.url} />
        <div className="absolute bottom-4 right-4 flex flex-col gap-4">
          <div className="flex items-center flex-col">
            <HandThumbUpIcon className="w-8 h-8 text-white" />
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
        </div>
      </div>
    </BaseLayout>
  );
};
