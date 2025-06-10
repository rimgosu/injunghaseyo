import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotiQueueService } from './noti-queue.service';
import { NOTIFICATION_PROCESSOR } from './utils/constants';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: NOTIFICATION_PROCESSOR.QUEUE,
    }),
  ],
  providers: [NotiQueueService],
  exports: [BullModule],
})
export class QueueModule {}
