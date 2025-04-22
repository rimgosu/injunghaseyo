import { GetProfileResDto } from './get-profile-res.dto';
import { UserForProfile } from '../utils/types';
import { OmitType } from '@nestjs/swagger';

export class GetOtherProfileResDto extends OmitType(GetProfileResDto, [
  'money',
  'reservedGroup',
]) {
  constructor(userData: UserForProfile) {
    super();
    const getProfileResDto = new GetProfileResDto(userData);

    this.introduction = getProfileResDto.introduction;
    this.nickname = getProfileResDto.nickname;
    this.profilePhotos = getProfileResDto.profilePhotos;
    this.currentGroup = getProfileResDto.currentGroup;
    this.completedGroup = getProfileResDto.completedGroup;
    this.totalProofDays = getProfileResDto.totalProofDays;
  }
}
