import { Injectable } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { NOTIFICATION_PROCESSOR } from './utils/constants';
import { CreateDeletedGroupNotiParams } from './utils/types';
import { PrismaService } from '@/prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
@Processor(NOTIFICATION_PROCESSOR.QUEUE)
export class NotiQueueService {
  constructor(private readonly prisma: PrismaService) {}

  @Process(NOTIFICATION_PROCESSOR.MISSION.DELETED_ROOM)
  async processDeletedGroupNotification(
    job: Job<CreateDeletedGroupNotiParams>,
  ) {
    const { data } = job;

    const { userId, groupId, refundAmount, groupName } = data;

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
