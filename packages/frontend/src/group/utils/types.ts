import { ProofMethodElemTypeEnum } from '@rimgosu/libs';

export const ProofMethodTypeView = {
  [ProofMethodElemTypeEnum.CHECK_LOCATION]: '위치 확인',
  [ProofMethodElemTypeEnum.CLICK_BUTTON]: '버튼 클릭',
  [ProofMethodElemTypeEnum.UPLOAD_PHOTO]: '인증 사진',
} as const;

export enum TodayGroupTopNavBarEnum {
  PROOF = 'PROOF',
  REWARD = 'REWARD',
  GALLERY = 'GALLERY',
}
