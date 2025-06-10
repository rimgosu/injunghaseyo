import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotiQueueService } from './noti-queue.service';
import { NOTIFICATION_PROCESSOR } from './utils/constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: NOTIFICATION_PROCESSOR.QUEUE,
    }),
  ],
  providers: [NotiQueueService],
  exports: [NotiQueueService],
})
export class QueueModule {}
