import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsStrongPassword,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
@ValidatorConstraint({ name: 'nicknameFormat', async: false })
class NicknameFormatConstraint implements ValidatorConstraintInterface {
  validate(nickname: string) {
    // 닉네임 길이 체크 (2-20자)
    if (nickname.length < 2 || nickname.length > 20) {
      return false;
    }

    // 완성형 한글, 영문자, 숫자만 허용하는 정규식
    const validCharacterPattern = /^[가-힣a-zA-Z0-9]+$/;

    // 자음/모음만 있는 한글 체크 (ㄱㄴㄷ, ㅏㅑㅓ 등)
    const incompleteHangulPattern = /[\u3131-\u314E\u314F-\u3163]/g;

    // 연속된 특수문자 체크
    const consecutiveSpecialCharsPattern =
      /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]{2,}/g;

    // 모든 조건 체크
    if (!validCharacterPattern.test(nickname)) {
      return false;
    }

    if (incompleteHangulPattern.test(nickname)) {
      return false;
    }

    if (consecutiveSpecialCharsPattern.test(nickname)) {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return '닉네임은 2-20자의 완성된 한글, 영문자, 숫자만 사용할 수 있습니다.';
  }
}

@ValidatorConstraint({ name: 'validate require agree', async: false })
class RequireAgreeConstraint implements ValidatorConstraintInterface {
  validate(requireAgree: boolean) {
    return !!requireAgree;
  }

  defaultMessage() {
    return '필수항목은 반드시 동의해야 합니다.';
  }
}

@ValidatorConstraint({ name: 'passwordMatch', async: false })
class PasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const obj = args.object as BaseUseraAuthDto;
    return confirmPassword === obj.password;
  }

  defaultMessage() {
    return '비밀번호가 일치하지 않습니다';
  }
}

@ValidatorConstraint({ name: 'changePasswordMatch', async: false })
class ChgPasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(confirmChangePassword: string, args: ValidationArguments) {
    const obj = args.object as BaseUseraAuthDto;
    return (
      confirmChangePassword === obj.changePassword &&
      obj.changePassword !== obj.password
    );
  }

  defaultMessage() {
    return '비밀번호가 일치하지 않습니다';
  }
}

export class BaseUseraAuthDto {
  @ApiProperty({
    description: 'user id',
    type: Number,
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'email',
    type: String,
    example: 'newnyup@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'auth code',
    type: String,
  })
  @IsNumberString()
  code: string;

  @ApiProperty({
    description: 'password',
    type: String,
    example: 'injung123!@#',
  })
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 0,
  })
  password: string;

  @ApiProperty({
    description: 'confirm password',
    type: String,
    example: 'injung123!@#',
  })
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 0,
  })
  @Validate(PasswordMatchConstraint)
  confirmPassword: string;

  @ApiProperty({
    description: 'change password',
    type: String,
    example: 'injung123!@#1',
  })
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 0,
  })
  changePassword: string;

  @ApiProperty({
    description: 'change password',
    type: String,
    example: 'injung123!@#1',
  })
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 0,
  })
  @Validate(ChgPasswordMatchConstraint)
  confirmChangePassword: string;

  @ApiProperty({
    description: 'nickname',
    type: String,
    example: 'injung2',
  })
  @IsString()
  @IsNotEmpty()
  @Validate(NicknameFormatConstraint)
  nickname: string;

  @ApiProperty({
    description: 'agree require',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return false;
  })
  @Validate(RequireAgreeConstraint)
  requireAgree: boolean;

  @ApiProperty({
    description: 'agree event',
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return false;
  })
  eventAgree: boolean;

  @ApiProperty({
    description: 'access token',
    type: String,
  })
  accessToken: string;

  @ApiProperty({
    description: 'sign in status',
    enum: UserStatus,
  })
  userStatus: UserStatus;
}
