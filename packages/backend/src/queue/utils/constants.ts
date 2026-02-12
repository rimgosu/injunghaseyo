import { NotificationType } from '@prisma/client';

interface ProcessorDefinition<T> {
  QUEUE: string;
  MISSION: {
    [key in keyof T]: T[key];
  };
}

export const NOTIFICATION_PROCESSOR: ProcessorDefinition<
  typeof NotificationType
> = {
  QUEUE: 'notification',
  MISSION: {
    ...NotificationType,
  },
};
