import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateDeletedGroupNotiParams } from './utils/types';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationStoreService {
  constructor(private readonly prisma: PrismaService) {}

  async createDeletedGroupNoti(params: CreateDeletedGroupNotiParams) {
    const { userId, groupId, refundAmount, groupName } = params;

    return await this.prisma.notification.create({
      data: {
        userId,
        groupId,
        moneyChange: refundAmount,
        type: NotificationType.DELETED_ROOM,
        title: `${groupName} 모임이 종료되었습니다.`,
        content: `방을 만든 사람이 방을 폭파했습니다. 총 ${refundAmount}원을 환불 받았습니다.`,
      },
    });
  }
}
