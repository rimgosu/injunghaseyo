import { useParams } from 'react-router-dom';
import { useProofHook } from '../hooks/useProofHook';
import { useEffect } from 'react';

export const ProofPage = () => {
  const { proofId } = useParams();
  const { getProof } = useProofHook();

  useEffect(() => {
    getProof(Number(proofId));
  }, [proofId]);

  return <div>ProofPage</div>;
};
