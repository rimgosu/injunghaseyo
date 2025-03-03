import { BadRequestException } from '@nestjs/common';
import { Wallet } from '@prisma/client';
import { CreateGroupElement } from './enums';
import {
  DatesValidationStrategy,
  DescriptionValidationStrategy,
  PriceValidationStrategy,
  ProofMethodValidationStrategy,
  TagsValidationStrategy,
  TitleValidationStrategy,
} from './group-create-validate.strategies';

export interface GroupElementValidationStrategy {
  validate(value: any, wallet?: Wallet): Promise<void>;
}

export class GroupElementValidationStrategyFactory {
  private static instance: GroupElementValidationStrategyFactory | null = null;
  private strategies = new Map<
    CreateGroupElement,
    GroupElementValidationStrategy
  >();

  private constructor() {
    this.strategies.set(
      CreateGroupElement.TITLE,
      new TitleValidationStrategy(),
    );
    this.strategies.set(
      CreateGroupElement.PRICE,
      new PriceValidationStrategy(),
    );
    this.strategies.set(
      CreateGroupElement.DESCRIPTION,
      new DescriptionValidationStrategy(),
    );
    this.strategies.set(
      CreateGroupElement.PROOF_METHOD,
      new ProofMethodValidationStrategy(),
    );
    this.strategies.set(
      CreateGroupElement.DATES,
      new DatesValidationStrategy(),
    );
    this.strategies.set(CreateGroupElement.TAGS, new TagsValidationStrategy());
  }

  public static getInstance(): GroupElementValidationStrategyFactory {
    if (!GroupElementValidationStrategyFactory.instance) {
      GroupElementValidationStrategyFactory.instance =
        new GroupElementValidationStrategyFactory();
    }
    return GroupElementValidationStrategyFactory.instance;
  }

  getStrategy(type: CreateGroupElement): GroupElementValidationStrategy {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new BadRequestException(`${type}에 대한 검증 전략이 없습니다.`);
    }
    return strategy;
  }
}
