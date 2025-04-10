import { Module } from '@nestjs/common';
import { CharacterRewardService } from './character-reward.service';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';

@Module({
  controllers: [CharacterController],
  providers: [CharacterRewardService, CharacterService],
  exports: [CharacterRewardService],
})
export class CharacterModule {}
