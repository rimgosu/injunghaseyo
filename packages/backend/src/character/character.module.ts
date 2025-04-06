import { Global, Module } from '@nestjs/common';
import { CharacterService } from './character.service';

@Module({
  providers: [CharacterService],
  exports: [CharacterService],
})
@Global()
export class CharacterModule {}
