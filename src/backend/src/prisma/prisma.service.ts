import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createSoftDeleteMiddleware } from 'prisma-soft-delete-middleware';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();

    this.$use(
      createSoftDeleteMiddleware({
        models: {
          User: true,
          ProfilePhoto: true,
          Group: true,
          Tag: true,
          GroupTagMap: true,
          Join: true,
          GroupDate: true,
          GroupProgress: true,
          GroupPhoto: true,
          PhotoComment: true,
          Payment: true,
          PaymentHistory: true,
        },
        defaultConfig: {
          field: 'deletedAt',
          createValue: (deleted: boolean) => {
            if (deleted) {
              return new Date();
            }
            return null;
          },
          allowToOneUpdates: true, // 관계 업데이트 허용
        },
      }),
    );
  }

  async onModuleInit() {
    await this.$connect();
  }
}
