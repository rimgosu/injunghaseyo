import { ReasonEnum } from '@rimgosu/libs';

export const ReportReasonType = {
  [ReasonEnum.SPAM]: '스팸 또는 혼동을 야기하는 콘텐츠',
  [ReasonEnum.FAKE_PROOF]: '인정할 수 없는 인증',
  [ReasonEnum.ADULT]: '성적인 컨텐츠',
  [ReasonEnum.HARMFUL_DANGEROUS]: '유해하거나 위험한 행위',
  [ReasonEnum.VIOLENT_DISGUSTING]: '폭력적 또는 혐오스러운 콘텐츠',
  [ReasonEnum.ABUSE_HATRED]: '증오 또는 학대하는 콘텐츠',
} as const;

export type ReportReasonType =
  (typeof ReportReasonType)[keyof typeof ReportReasonType];
