import { ApiProperty } from '@nestjs/swagger';

export class BaseCursorPaginationResDto<T> {
  @ApiProperty({
    description: '데이터 목록',
  })
  items: T[];

  @ApiProperty({
    description: '다음 페이지 존재 여부',
    type: Boolean,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description:
      '다음 페이지 조회를 위한 커서 값 (다음 페이지가 없는 경우 null)',
    required: false,
    type: Number,
  })
  nextCursor?: number;

  constructor(items: T[], hasNextPage: boolean, nextCursor?: number) {
    this.items = items;
    this.hasNextPage = hasNextPage;
    this.nextCursor = nextCursor;
  }
}
