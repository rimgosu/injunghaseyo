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

const prisma = new PrismaClient();

async function main() {
  try {
    await createCharacters();
  } catch (error) {
    console.error('Character creation failed:', error);
  }

  try {
    await createTags();
  } catch (error) {
    console.error('Tag creation failed:', error);
  }

  try {
    await createAdminUser();
  } catch (error) {
    console.error('Admin user creation failed:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function createAdminUser() {
  const admin = await prisma.user.create({
    data: {
      email: 'admin@injunghaseyo.com',
      eventAgree: true,
      nickname: '관리자',
      // password: 'injung123!@#'
      password:
        '9370442d8ac86a42b323217ee422e9e9f556111888e41141dc6a159cde687dd7e06472f2a5e43dde5cd490abe271792e3942d5c22fafc67b036d603b52735abc',
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
    },
  });

  console.log(`admin user created: ${admin.id}`);
}

async function createTags() {
  const createdTags = await prisma.tag.createMany({
    data: tags.map((tag) => ({ name: tag })),
  });

  console.log(`tag generated: ${createdTags.count}`);
}

async function createCharacters() {
  const yello = await prisma.character.create({
    data: {
      name: '노랑이',
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
      name: '초록이',
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
      name: '파랑이',
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

  console.log('Seed data created:');
  console.log('Character:', yello, green, blue);
}
