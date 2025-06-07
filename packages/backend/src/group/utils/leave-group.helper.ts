import { JoinRole, WalletHistoryReason } from '@prisma/client';
import { GroupForLeave, JoinForLeave } from './types';
import {
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { PrismaService } from '@/prisma/prisma.service';

dayjs.extend(utc);
dayjs.extend(timezone);

export class LeaveGroupHelper {
  private readonly groupDates: dayjs.Dayjs[];
  private readonly joinedAt: dayjs.Dayjs;
  private readonly now: dayjs.Dayjs;
  private readonly existMyProof: boolean;

  // delete group
  private readonly prisma: PrismaService;
  private readonly existProof: boolean;
  private readonly joinRole: JoinRole;
  private readonly groupId: number;
  private readonly groupDateIds: number[];
  private readonly groupForLeave: GroupForLeave;
  private readonly groupPrice: number;

  constructor(join: JoinForLeave, group: GroupForLeave, prisma: PrismaService) {
    this.groupDates = group.groupDate
      .map((d) => dayjs(d.date).tz('Asia/Seoul'))
      .sort((a, b) => a.valueOf() - b.valueOf());
    this.joinedAt = dayjs(join.createdAt).tz('Asia/Seoul');
    this.joinRole = join.joinRole;
    this.existMyProof = join.groupProgress.length > 0;
    this.existProof = group.groupDate.some((d) => d.groupProgress.length > 0);
    this.groupId = group.id;
    this.prisma = prisma;
    this.groupDateIds = group.groupDate.map((d) => d.id);
    this.groupPrice = group.price;
    this.groupForLeave = group;
    this.now = dayjs().tz('Asia/Seoul');
  }

  /**
   * 그룹 삭제 & 환불
   */
  async deleteGroup() {
    if (this.joinRole !== JoinRole.HOST)
      throw new ForbiddenException('host만 그룹을 삭제할 수 있습니다.');
    if (this.existProof || this.now.isAfter(this.groupDates[0]))
      throw new ForbiddenException(
        '이미 진행 중인 모임입니다. 모임을 삭제할 수 없습니다.',
      );

    return await this.prisma.$transaction(async (tx) => {
      const deletedGroupProgress = await tx.groupProgress.deleteMany({
        where: {
          groupDateId: {
            in: this.groupDateIds,
          },
        },
      });

      const deletedAndRefund = await Promise.all([
        tx.group.update({
          where: {
            id: this.groupId,
          },
          data: {
            deletedAt: new Date(),
          },
        }),
        tx.join.updateMany({
          where: {
            groupId: this.groupId,
          },
          data: {
            deletedAt: new Date(),
          },
        }),
        tx.groupDate.deleteMany({
          where: {
            groupId: this.groupId,
          },
        }),
        tx.proofMethod.deleteMany({
          where: {
            groupId: this.groupId,
          },
        }),
        tx.groupTagMap.deleteMany({
          where: {
            groupId: this.groupId,
          },
        }),
        ...this.groupForLeave.join.map((j) => {
          return tx.wallet.update({
            where: {
              userId: j.userId,
            },
            data: {
              money: { increment: this.groupPrice },
              walletHistory: {
                create: {
                  previousMoney: j.user.wallet.money,
                  currentMoney: j.user.wallet.money + this.groupPrice,
                  reason: WalletHistoryReason.REFUND,
                  joinId: j.id,
                },
              },
            },
          });
        }),
      ]);

      return {
        deletedGroupProgress,
        deletedAndRefund,
      };
    });
  }

  /**
   * 환불 가능한 경우
   *
   * 항상 적용
   * - groupProgress 진행 X여야만 환불 가능
   * - 모임 참여 후 1시간 내로 떠날 경우 환불 가능
   *
   * 모임 진행 전
   * - 무조건 환불 가능
   *
   * 모임 진행 후
   * - 모임 참여 후 다음날이 되기 전까지
   */
  canRefund(): boolean {
    if (this.existMyProof) return false;
    if (this.now.diff(this.joinedAt, 'hour') < 1) return true;

    const earliestGroupDate = this.groupDates[0];

    const isBeforeGroup = this.now.isBefore(earliestGroupDate.startOf('day'));
    if (isBeforeGroup) return true;

    const joinNextGroupDate = this.groupDates.find((date) =>
      date.isAfter(this.joinedAt),
    );
    if (!joinNextGroupDate) {
      throw new UnprocessableEntityException(
        '참여 이후 진행될 그룹 날짜가 없습니다. 서버의 참여 로직이 잘못되었습니다.',
      );
    }

    return this.now.isBefore(joinNextGroupDate.startOf('day'));
  }
}
