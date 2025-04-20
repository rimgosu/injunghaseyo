import { GetProfileResDto } from './get-profile-res.dto';
import { UserForProfile } from '../utils/types';
import { ApiHideProperty } from '@nestjs/swagger';

export class GetOtherProfileResDto extends GetProfileResDto {
  @ApiHideProperty()
  money: never;

  @ApiHideProperty()
  currentGroup: never;

  @ApiHideProperty()
  reservedGroup: never;

  constructor(userData: UserForProfile) {
    super(userData);

    delete this.money;
    delete this.currentGroup;
    delete this.reservedGroup;
  }
}
