import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { CharacterRewardService } from '@/character/character-reward.service';

@Module({
  controllers: [GroupController],
  providers: [GroupService, CharacterRewardService],
})
export class GroupModule {}
