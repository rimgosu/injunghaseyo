import { Wallet } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { GroupElementValidationStrategy } from './group-create-validate.strategy';
import { ProofMethodElem } from './types';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validateGroupDates } from './utils';

/**
 * @description 제목은 3글자 이상
 */
export class TitleValidationStrategy implements GroupElementValidationStrategy {
  async validate(value: string): Promise<void> {
    if (!value || value.length < 3) {
      throw new BadRequestException('제목은 3글자 이상이어야 합니다.');
    }
  }
}

/**
 * @description 가격은 10000원 이상, 해당 유저 지갑에 있는 돈보다 많아야 한다.
 */
export class PriceValidationStrategy implements GroupElementValidationStrategy {
  async validate(value: number, wallet: Wallet): Promise<void> {
    if (value < 10000)
      throw new BadRequestException('가격은 10000원 이상이어야 합니다.');

    if (value > wallet.money)
      throw new BadRequestException('지갑 잔액이 부족합니다.');
  }
}

/**
 * @description 설명은 10글자 이상
 */
export class DescriptionValidationStrategy
  implements GroupElementValidationStrategy
{
  async validate(value: string): Promise<void> {
    if (!value || value.length < 10) {
      throw new BadRequestException('설명은 10글자 이상이어야 합니다.');
    }
  }
}

/**
 * @description 증빙 방법은 적어도 하나 이상, 양식에 맞게 보낼 것
 */
export class ProofMethodValidationStrategy
  implements GroupElementValidationStrategy
{
  async validate(value: ProofMethodElem[]): Promise<void> {
    if (!value || value.length < 1) {
      throw new BadRequestException('증빙 방법은 최소 하나 이상이어야 합니다.');
    }

    for (const elem of value) {
      const proofMethodInstance = plainToInstance(ProofMethodElem, elem);
      const errors = validateSync(proofMethodInstance);

      if (errors.length > 0) {
        throw new BadRequestException(
          `유효하지 않은 증빙 방법 형식: ${errors.map((err) => Object.values(err.constraints)).join(', ')}`,
        );
      }

      if (elem.fromMin > elem.toMin) {
        throw new BadRequestException(
          '증빙 시작 시간은 증빙 종료 시간보다 작아야 합니다.',
        );
      }
    }
  }
}

/**
 * @description 날짜는 최소 5개 이상, 시작 시간으로부터 3일 이전에 생성되어야 한다.
 */
export class DatesValidationStrategy implements GroupElementValidationStrategy {
  async validate(value: string[]): Promise<void> {
    if (new Set(value).size < 5) {
      throw new BadRequestException('날짜는 최소 5개 이상이어야 합니다.');
    }

    if (!validateGroupDates(value)) {
      throw new BadRequestException(
        '시작 시간으로부터 3일 이전에 생성되어야 합니다.',
      );
    }
  }
}

/**
 * @description 태그는 없어도 된다.
 */
export class TagsValidationStrategy implements GroupElementValidationStrategy {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(value: string[]): Promise<void> {}
}
