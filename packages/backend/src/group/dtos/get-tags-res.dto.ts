import { PickType } from '@nestjs/swagger';
import { BaseGroupDto } from './base.dto';
import { Tag } from '@prisma/client';
import * as Hangul from 'hangul-js';

export class GetTagsRes extends PickType(BaseGroupDto, ['tags']) {
  constructor(tags: Tag[], tagSearch: string) {
    super();

    const searchCharArray = Hangul.disassemble(tagSearch);

    const matchedTags = tags
      .map((tag) => ({
        ...tag,
        similarity: this.calculateSimilarity(
          Hangul.disassemble(tag.name),
          searchCharArray,
        ),
      }))
      .filter((tag) => tag.similarity > 0.2) // 유사도 50% 이상만
      .sort((a, b) => b.similarity - a.similarity)
      .map((tag) => tag.name)
      .slice(0, 5);

    this.tags = matchedTags;
  }

  private calculateSimilarity(a: string[], b: string[]): number {
    const maxLength = Math.max(a.length, b.length);
    const matchCount = a.filter((char, i) => char === b[i]).length;
    return matchCount / maxLength;
  }
}
