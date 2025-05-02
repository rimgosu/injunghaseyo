import { useParams } from 'react-router-dom';
import { useProofHook } from '../hooks/useProofHook';
import { useEffect, useState } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { XButton } from '../../common/components/XButton';
import { GetProofRes } from '@rimgosu/libs';

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
      paddingTop="40%"
    >
      <div className="bg-black flex justify-center items-center">
        <img src={proof?.url} />
      </div>
    </BaseLayout>
  );
};
