import { JoinRole, PrismaClient, Role, UserStatus } from '@prisma/client';
import {
  blueLv1,
  blueLv2,
  blueLv3,
  blueLv4,
  blueLv5,
  greenLv1,
  greenLv2,
  greenLv3,
  greenLv4,
  greenLv5,
  yelloLv1,
  yelloLv2,
  yelloLv3,
  yelloLv4,
  yelloLv5,
} from './utils/svgs';
import { tags } from './utils/tags';
import { Logger } from '@nestjs/common';
import { blueName, greenName, yelloName } from './utils/types';
import { GroupDateUtil } from './utils/group-date.util';
import { GroupSeedData } from './utils/group-seed.data';
import { UserSeedData } from './utils/user-seed.data';

const prisma = new PrismaClient();
const logger = new Logger('PrismaSeed', { timestamp: true });

const handleSeedOperation = async (
  operation: () => Promise<void>,
  entityName: string,
) => {
  try {
    await operation();
  } catch (error) {
    if (error.code === 'P2002') {
      logger.debug(`${entityName} already exists`);
    } else {
      logger.error(`${entityName} creation failed:`, error);
    }
  }
};

async function main() {
  await handleSeedOperation(createCharacters, 'Character');
  await handleSeedOperation(createTags, 'Tag');
  await handleSeedOperation(createAdminUser, 'Admin user');
  await handleSeedOperation(createUsers, 'User');
  await handleSeedOperation(createGroups, 'Group');
}

/**
 * @description 그룹 생성
 *
 * 1. 현재 진행 중인 그룹
 * 2. 종료된 그룹
 * 3. 아직 진행 중이지 않은 그룹 2개
 */
async function createGroups() {
  const groupDateUtil = new GroupDateUtil();

  // 1. 현재 진행 중인 그룹
  const { group: inProgressGroup, groupDate: inProgressGroupDate } =
    await new GroupSeedData(
      99999,
      30000,
      '현재 진행 그룹',
      '현재 진행 중인 그룹입니다.',
      tags[0],
      ['아침 촬영', '저녁 촬영'],
      groupDateUtil.inProgressYmds,
    ).createGroupSeedData(prisma, [
      UserSeedData.users.admin,
      UserSeedData.users.user1,
    ]);

  // 2. 종료된 그룹
  const { group: completedGroup, groupDate: completedGroupDate } =
    await new GroupSeedData(
      99998,
      50000,
      '종료된 그룹',
      '종료된 그룹입니다.',
      tags[1],
      ['아침 촬영', '저녁 촬영'],
      groupDateUtil.finishedYmds,
    ).createGroupSeedData(prisma, [
      UserSeedData.users.admin,
      UserSeedData.users.user1,
      UserSeedData.users.user2,
    ]);

  // 3. 아직 진행 중이지 않은 그룹 2개
  const { group: notStartedGroup1, groupDate: notStartedGroupDate1 } =
    await new GroupSeedData(
      99997,
      10000,
      '아직 진행 중이지 않은 그룹1',
      '아직 진행 중이지 않은 그룹1입니다.',
      tags[2],
      ['아침 촬영', '저녁 촬영'],
      groupDateUtil.notStartedYmds,
    ).createGroupSeedData(prisma, [UserSeedData.users.admin]);

  const { group: notStartedGroup2, groupDate: notStartedGroupDate2 } =
    await new GroupSeedData(
      99996,
      100,
      '아직 진행 중이지 않은 그룹2',
      '아직 진행 중이지 않은 그룹2입니다.',
      tags[3],
      ['아침에 버튼 누르기'],
      groupDateUtil.notStartedYmds,
    ).createGroupSeedData(prisma, [
      UserSeedData.users.admin,
      UserSeedData.users.user1,
      UserSeedData.users.user2,
    ]);

  logger.debug(`${inProgressGroup.id} inProgressGroup created`);
  logger.debug(`${inProgressGroupDate.length} inProgressGroupDate created`);
  logger.debug(`${completedGroup.id} completedGroup created`);
  logger.debug(`${completedGroupDate.length} completedGroupDate created`);
  logger.debug(`${notStartedGroup1.id} notStartedGroup1 created`);
  logger.debug(`${notStartedGroupDate1.length} notStartedGroupDate1 created`);
  logger.debug(`${notStartedGroup2.id} notStartedGroup2 created`);
  logger.debug(`${notStartedGroupDate2.length} notStartedGroupDate2 created`);
}

async function createUsers() {
  const users = (
    await Promise.all([
      prisma.user.upsert({
        where: { email: 'test1@injunghaseyo.com' },
        update: {},
        create: {
          email: 'test1@injunghaseyo.com',
          eventAgree: true,
          nickname: '테스트1',
          password:
            '9370442d8ac86a42b323217ee422e9e9f556111888e41141dc6a159cde687dd7e06472f2a5e43dde5cd490abe271792e3942d5c22fafc67b036d603b52735abc', // password: 'injung123!@#'
          salt: '8e5dc47e8a22a1bc2c86b92b488160eb',
          role: Role.USER,
          status: UserStatus.ACTIVE,
          profilePhoto: {
            create: {
              url: 'https://injunghaseyo-dev.s3.ap-northeast-2.amazonaws.com/profile-photo/basic-profile.svg',
            },
          },
          wallet: {
            create: {
              money: 1000000,
            },
          },
          myCharacter: {
            create: {
              character: {
                connect: {
                  name: yelloName,
                },
              },
            },
          },
        },
      }),

      prisma.user.upsert({
        where: { email: 'test2@injunghaseyo.com' },
        update: {},
        create: {
          email: 'test2@injunghaseyo.com',
          eventAgree: true,
          nickname: '테스트2',
          password:
            '9370442d8ac86a42b323217ee422e9e9f556111888e41141dc6a159cde687dd7e06472f2a5e43dde5cd490abe271792e3942d5c22fafc67b036d603b52735abc', // password: 'injung123!@#'
          salt: '8e5dc47e8a22a1bc2c86b92b488160eb',
          role: Role.USER,
          status: UserStatus.ACTIVE,
          profilePhoto: {
            create: {
              url: 'https://injunghaseyo-dev.s3.ap-northeast-2.amazonaws.com/profile-photo/basic-profile.svg',
            },
          },
          wallet: {
            create: {
              money: 1000000,
            },
          },
          myCharacter: {
            create: {
              character: {
                connect: {
                  name: greenName,
                },
              },
            },
          },
        },
      }),
    ])
  ).map((user) => ({
    ...user,
    joinRole: JoinRole.ATTENDEE,
  }));

  UserSeedData.users.user1 = users[0];
  UserSeedData.users.user2 = users[1];

  logger.debug(`${users.length} users created`);
}

async function createAdminUser() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@injunghaseyo.com' },
    update: {},
    create: {
      email: 'admin@injunghaseyo.com',
      eventAgree: true,
      nickname: '관리자',
      password:
        '9370442d8ac86a42b323217ee422e9e9f556111888e41141dc6a159cde687dd7e06472f2a5e43dde5cd490abe271792e3942d5c22fafc67b036d603b52735abc', // password: 'injung123!@#'
      salt: '8e5dc47e8a22a1bc2c86b92b488160eb',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      profilePhoto: {
        create: {
          url: 'https://injunghaseyo-dev.s3.ap-northeast-2.amazonaws.com/profile-photo/basic-profile.svg',
        },
      },
      wallet: {
        create: {
          money: 1000000,
        },
      },
      myCharacter: {
        create: {
          character: {
            connect: {
              name: blueName,
            },
          },
        },
      },
    },
  });

  UserSeedData.users.admin = {
    ...admin,
    joinRole: JoinRole.ATTENDEE,
  };

  logger.debug(`admin user created: ${admin.id}`);
}

async function createTags() {
  const createdTags = await prisma.tag.createMany({
    data: tags.map((tag) => ({ name: tag })),
  });

  logger.debug(`tag generated: ${createdTags.count}`);
}

async function createCharacters() {
  const yello = await prisma.character.create({
    data: {
      name: yelloName,
      description: '귀여운 노랑이입니다.',
      characterInfo: {
        createMany: {
          data: [
            {
              level: 1,
              expNeed: 0,
              photoUrl: yelloLv1,
            },
            {
              level: 2,
              expNeed: 100,
              photoUrl: yelloLv2,
            },
            {
              level: 3,
              expNeed: 225,
              photoUrl: yelloLv3,
            },
            {
              level: 4,
              expNeed: 375,
              photoUrl: yelloLv4,
            },
            {
              level: 5,
              expNeed: 575,
              photoUrl: yelloLv5,
            },
          ],
        },
      },
    },
  });

  const green = await prisma.character.create({
    data: {
      name: greenName,
      description: '귀여운 초록이입니다.',
      characterInfo: {
        createMany: {
          data: [
            {
              level: 1,
              expNeed: 0,
              photoUrl: greenLv1,
            },
            {
              level: 2,
              expNeed: 100,
              photoUrl: greenLv2,
            },
            {
              level: 3,
              expNeed: 225,
              photoUrl: greenLv3,
            },
            {
              level: 4,
              expNeed: 375,
              photoUrl: greenLv4,
            },
            {
              level: 5,
              expNeed: 575,
              photoUrl: greenLv5,
            },
          ],
        },
      },
    },
  });

  const blue = await prisma.character.create({
    data: {
      name: blueName,
      description: '귀여운 파랑이입니다.',
      characterInfo: {
        createMany: {
          data: [
            {
              level: 1,
              expNeed: 0,
              photoUrl: blueLv1,
            },
            {
              level: 2,
              expNeed: 100,
              photoUrl: blueLv2,
            },
            {
              level: 3,
              expNeed: 225,
              photoUrl: blueLv3,
            },
            {
              level: 4,
              expNeed: 375,
              photoUrl: blueLv4,
            },
            {
              level: 5,
              expNeed: 575,
              photoUrl: blueLv5,
            },
          ],
        },
      },
    },
  });

  logger.debug('Seed data created:');
  logger.debug('Character:', yello, green, blue);
}

main()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
