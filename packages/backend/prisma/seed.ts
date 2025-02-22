import { PrismaClient, Role, UserStatus } from '@prisma/client';
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
import {
  blueName,
  greenName,
  inProgressGroupId,
  yelloName,
} from './utils/types';
import { GroupDateUtil } from './utils/group-date.util';

const prisma = new PrismaClient();
const logger = new Logger('PrismaSeed', { timestamp: true });

async function main() {
  try {
    await createCharacters();
  } catch (error) {
    if (error.code === 'P2002') {
      logger.debug('Character already exists');
    } else {
      logger.error('Character creation failed:', error);
    }
  }

  try {
    await createTags();
  } catch (error) {
    if (error.code === 'P2002') {
      logger.debug('Tag already exists');
    } else {
      logger.error('Tag creation failed:', error);
    }
  }

  try {
    await createAdminUser();
  } catch (error) {
    if (error.code === 'P2002') {
      logger.debug('Admin user already exists');
    } else {
      logger.error('Admin user creation failed:', error);
    }
  }

  try {
    await createUsers();
  } catch (error) {
    if (error.code === 'P2002') {
      logger.debug('User already exists');
    } else {
      logger.error('User creation failed:', error);
    }
  }
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

  const inProgressGroup = await prisma.group.upsert({
    where: {
      id: inProgressGroupId,
    },
    update: {},
    create: {
      id: inProgressGroupId,
      price: 30000,
      title: '현재 진행 그룹',
      description: '현재 진행 중인 그룹입니다.',
      groupTagMap: {
        create: {
          tag: {
            connect: {
              name: tags[0],
            },
          },
        },
      },
      proofMethod: {
        createMany: {
          data: ['아침 촬영', '저녁 촬영'].map((method) => ({
            method,
          })),
        },
      },
      groupDate: {
        createMany: {
          data: groupDateUtil.inProgressYmds.map((date) => ({ date })),
        },
      },
    },
    include: {
      groupDate: true,
    },
  });

  // groupDate seed 시점에 따라 업데이트
  const groupDate = await inProgressGroup.groupDate.map(async (d, index) => {
    return await prisma.groupDate.update({
      where: {
        id: d.id,
      },
      data: {
        date: groupDateUtil.inProgressYmds[index],
      },
    });
  });

  // 2. 종료된 그룹
}

async function createUsers() {
  const users = await Promise.all([
    prisma.user.create({
      data: {
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

    prisma.user.create({
      data: {
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
  ]);

  logger.debug(`${users.length} users created`);
}

async function createAdminUser() {
  const admin = await prisma.user.create({
    data: {
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
