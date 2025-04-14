export enum JoinStatus {
  // 참여
  RESERVED = 'RESERVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',

  // 미참여
  NOT_JOINED = 'NOT_JOINED',
  NOT_JOINABLE = 'NOT_JOINABLE',
}

export enum GroupStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum CreateGroupElement {
  TITLE = 'TITLE',
  PRICE = 'PRICE',
  DESCRIPTION = 'DESCRIPTION',
  PROOF_METHOD = 'PROOF_METHOD',
  DATES = 'DATES',
  TAGS = 'TAGS',
}

/**
 * @description 진행중인 인증 상태
 */
export enum InProgressGroupTodayStatus {
  COMPLETED = 'COMPLETED',
  NO_PROOF = 'NO_PROOF', // 중간에 참여하는 경우
  IN_PROGRESS = 'IN_PROGRESS',
}
