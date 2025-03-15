import { ApiProperty } from '@nestjs/swagger';
import { Prisma, ProofMethod, ProofType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  Max,
  MinLength,
} from 'class-validator';

export class ProofMethodElem implements Partial<ProofMethod> {
  @ApiProperty({
    description: '인증 방법 내용',
    type: String,
    example: '헬스장 출입 전',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: '인증 방법 내용은 최소 3글자 이상이어야 합니다' })
  contents: string;

  @ApiProperty({
    description: '인증 방법 타입',
    enum: ProofType,
    example: ProofType.CHECK_LOCATION,
  })
  @IsEnum(ProofType)
  @IsNotEmpty()
  type: ProofType;

  @ApiProperty({
    description: '인증 시작 시간',
    type: Number,
    example: 0,
  })
  @IsNumber()
  @Min(0)
  @Max(2400)
  @IsNotEmpty()
  fromMin: number;

  @ApiProperty({
    description: '인증 종료 시간',
    type: Number,
    example: 2400,
  })
  @IsNumber()
  @Min(0)
  @Max(2400)
  @IsNotEmpty()
  toMin: number;
}

export const GROUP_WITH_INCLUDE = Prisma.validator<Prisma.GroupDefaultArgs>()({
  include: {
    groupTagMap: {
      include: {
        tag: true,
      },
    },
    join: {
      include: {
        user: {
          include: {
            profilePhoto: true,
          },
        },
      },
    },
    groupDate: true,
    proofMethod: true,
  },
});

export type GroupWith = Prisma.GroupGetPayload<typeof GROUP_WITH_INCLUDE>;

export interface DateInterface {
  date: string;
}

export const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
export const NINE_HOURS_IN_MS = 1000 * 60 * 60 * 9;

export const GROUP_WITH_TODAY = Prisma.validator<Prisma.GroupDefaultArgs>()({
  include: {
    groupDate: {
      include: {
        groupProgress: true,
      },
    },
    proofMethod: {
      include: {
        groupProgress: {
          include: {
            proof: {
              include: {
                photoProof: true,
                buttonClickProof: true,
                locationProof: true,
              },
            },
          },
        },
      },
    },
    join: true,
  },
});

export type GroupWithToday = Prisma.GroupGetPayload<typeof GROUP_WITH_TODAY>;

export type GroupWithProofDate = Prisma.GroupGetPayload<{
  include: {
    proofMethod: true;
    groupDate: true;
  };
}>;

export type UserWithPhoto = Prisma.UserGetPayload<{
  include: {
    profilePhoto: true;
  };
}>;

export type GroupWithJoin = Prisma.GroupGetPayload<{
  include: {
    groupDate: {
      include: {
        groupProgress: true;
      };
    };
    join: true;
    proofMethod: true;
  };
}>;
