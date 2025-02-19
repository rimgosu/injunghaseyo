import { PrismaClient } from '@prisma/client';
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
  await createCharacters();
  await createTags();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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
