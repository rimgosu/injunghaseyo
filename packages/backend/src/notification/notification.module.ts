import { Global, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationStoreService } from './notification-store.service';

@Global()
@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationStoreService],
  exports: [NotificationStoreService],
})
export class NotificationModule {}
