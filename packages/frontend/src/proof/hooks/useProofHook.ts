import { GetProofsRes, ProofControllerGetProofsParams } from '@rimgosu/libs';
import { ApiSingleton } from '../../common/apiSingleton';
import { ApiErrorType, ApiResponse } from '../../common/types';

export const useProofHook = () => {
  const getProofs = async (
    params: ProofControllerGetProofsParams,
  ): Promise<ApiResponse<GetProofsRes>> => {
    return await ApiSingleton.getInstance()
      .proofs.proofControllerGetProofs(params)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  return {
    getProofs,
  };
};
