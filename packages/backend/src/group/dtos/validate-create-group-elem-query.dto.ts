import { PickType } from '@nestjs/swagger';
import { BaseGroup } from './base.dto';
import { CreateGroupElement } from '../utils/enums';

export class ValidateCreateGroupElementBody extends PickType(BaseGroup, [
  'validateValue',
  'validateType',
]) {
  static get examples() {
    return {
      title: {
        value: {
          validateValue: '헬스장 인증 모임',
          validateType: CreateGroupElement.TITLE,
        },
        description: '제목 검증 예제',
      },
      price: {
        value: {
          validateValue: 30000,
          validateType: CreateGroupElement.PRICE,
        },
        description: '가격 검증 예제',
      },
      description: {
        value: {
          validateValue: '매일 헬스장에서 운동하고 인증하는 모임입니다.',
          validateType: CreateGroupElement.DESCRIPTION,
        },
        description: '설명 검증 예제',
      },
      proofMethod: {
        value: {
          validateType: CreateGroupElement.PROOF_METHOD,
          validateValue: [
            {
              contents: '헬스장 출입 인증',
              type: 'CHECK_LOCATION',
              fromMin: 0,
              toMin: 2400,
            },
            {
              contents: '운동 완료 인증',
              type: 'UPLOAD_PHOTO',
              fromMin: 0,
              toMin: 2400,
            },
          ],
        },
        description: '인증 방법 검증 예제',
      },
      dates: {
        value: {
          validateType: CreateGroupElement.DATES,
          validateValue: ['2024-03-20', '2024-03-21', '2024-03-22'],
        },
        description: '날짜 검증 예제',
      },
      tags: {
        value: {
          validateType: CreateGroupElement.TAGS,
          validateValue: ['헬스', '운동', '건강'],
        },
        description: '태그 검증 예제',
      },
    };
  }
}
