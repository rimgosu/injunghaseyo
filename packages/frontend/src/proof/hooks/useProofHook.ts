import {
  CreateCommentBody,
  GetCommentsResDto,
  GetProofRes,
  GetProofsRes,
  GetRepliesResDto,
  ProofControllerCreateCommentParams,
  ProofControllerGetCommentsParams,
  ProofControllerGetProofsParams,
  ProofControllerGetRepliesParams,
  ProofControllerInteractionCommentParams,
  ProofControllerInteractionProofParams,
  ProofControllerReportProofParams,
  UpdateCommentBody,
} from '@rimgosu/libs';
import { ApiSingleton } from '../../common/apiSingleton';
import { ApiErrorType, ApiResponse } from '../../common/types';

export const useProofHook = () => {
  const interactionComment = async (
    query: ProofControllerInteractionCommentParams,
  ): Promise<ApiResponse<any>> => {
    return await ApiSingleton.getInstance().proofs.proofControllerInteractionComment(
      query,
    );
  };

  const getReplies = async (
    query: ProofControllerGetRepliesParams,
  ): Promise<ApiResponse<GetRepliesResDto>> => {
    return await ApiSingleton.getInstance()
      .proofs.proofControllerGetReplies(query)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const deleteComment = async (
    proofId: number,
    commentId: number,
  ): Promise<ApiResponse<any>> => {
    return await ApiSingleton.getInstance()
      .proofs.proofControllerDeleteComment(proofId, commentId)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const updateComment = async (
    proofId: number,
    commentId: number,
    body: UpdateCommentBody,
  ): Promise<ApiResponse<any>> => {
    return await ApiSingleton.getInstance()
      .proofs.proofControllerUpdateComment(proofId, commentId, body)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const getComments = async (
    query: ProofControllerGetCommentsParams,
  ): Promise<ApiResponse<GetCommentsResDto>> => {
    return await ApiSingleton.getInstance()
      .proofs.proofControllerGetComments(query)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const createComment = async (
    query: ProofControllerCreateCommentParams,
    body: CreateCommentBody,
  ): Promise<ApiResponse<any>> => {
    return await ApiSingleton.getInstance()
      .proofs.proofControllerCreateComment(query, body)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const reportProof = async (
    query: ProofControllerReportProofParams,
  ): Promise<ApiResponse<any>> => {
    return await ApiSingleton.getInstance()
      .proofs.proofControllerReportProof(query)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const interactionProof = async (
    query: ProofControllerInteractionProofParams,
  ): Promise<ApiResponse<any>> => {
    return await ApiSingleton.getInstance()
      .proofs.proofControllerInteractionProof(query)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const getProof = async (
    proofId: number,
  ): Promise<ApiResponse<GetProofRes>> => {
    return await ApiSingleton.getInstance()
      .proofs.proofControllerGetProof(proofId)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

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
    getProof,
    interactionProof,
    reportProof,
    createComment,
    getComments,
    updateComment,
    deleteComment,
    getReplies,
    interactionComment,
  };
};
