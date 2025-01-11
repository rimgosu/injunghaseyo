import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Validate } from 'class-validator';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'stringMatch', async: false })
export class StringMatchConstraint implements ValidatorConstraintInterface {
  validate(auth: string) {
    console.log(auth);

    return auth === 'tlaznd@0801';
  }

  defaultMessage(args: ValidationArguments) {
    return `관리자 권한을 얻을 수 없습니다.`;
  }
}

export class BaseUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '비밀번호',
    example: 'tlaznd@0801',
  })
  @Validate(StringMatchConstraint)
  auth: string;

  @IsNumber()
  @ApiProperty({
    description: '얻을 인증머니',
    example: 35000,
  })
  @Transform(({ value }) => +value)
  money: number;
}
