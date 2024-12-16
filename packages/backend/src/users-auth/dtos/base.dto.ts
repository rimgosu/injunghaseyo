import { ApiProperty } from '@nestjs/swagger';
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

  accessToken: string;
}
