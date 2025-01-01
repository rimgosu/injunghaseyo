import { AuthControllerSignUpParams } from "@rimgosu/libs";

export interface SignUpFormData extends AuthControllerSignUpParams {
  ageAgree: boolean;
  termsAgree: boolean;
  privacyAgree: boolean;
  marketingAgree: boolean;
  smsAgree: boolean;
}
