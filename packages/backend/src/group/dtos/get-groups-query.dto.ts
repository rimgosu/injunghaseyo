import { BaseCursorPaginationQueryDto } from '@/common/base-cursor-pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { transformSearchQuery } from '../utils/transform-search-query.util';
import { Prisma } from '@prisma/client';

export class GetGroupsQueryDto extends BaseCursorPaginationQueryDto {
  @ApiProperty({
    description: '검색 쿼리',
    type: String,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => transformSearchQuery(value))
  q?: string | number | undefined;

  get groupWhereInput(): Prisma.GroupWhereInput {
    return {
      deletedAt: null,
      ...(this.q && {
        OR: [
          ...(typeof this.q === 'number'
            ? [
                {
                  price: {
                    gte: this.q - this.q * 0.1,
                    lte: this.q + this.q * 0.1,
                  },
                },
              ]
            : []),
          { title: { contains: String(this.q), mode: 'insensitive' } },
          { description: { contains: String(this.q), mode: 'insensitive' } },
          {
            proofMethod: {
              some: {
                contents: { contains: String(this.q), mode: 'insensitive' },
              },
            },
          },
          {
            groupTagMap: {
              some: {
                tag: {
                  name: { contains: String(this.q), mode: 'insensitive' },
                },
              },
            },
          },
        ],
      }),
    };
  }
}
