import { AuthControllerSignUpParams } from "@rimgosu/libs";

export interface SignUpFormData extends AuthControllerSignUpParams {
  ageAgree: boolean;
  termsAgree: boolean;
  privacyAgree: boolean;
  marketingAgree: boolean;
  smsAgree: boolean;
}

export interface EmailVerificationState {
  show: boolean;
  code: string;
  isVerified: boolean;
  timer: number;
}
