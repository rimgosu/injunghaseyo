import { ApiProperty } from '@nestjs/swagger';
import { Wallet } from '@prisma/client';

export class GetMoneyDto {
  @ApiProperty({
    description: '보유한 인증 머니',
    example: 10000,
    type: Number,
  })
  money: number;

  constructor(wallet: Wallet) {
    this.money = wallet.money;
  }
}
