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
} from './svgs/svgs';

const prisma = new PrismaClient();

async function main() {
  const yello = await prisma.character.create({
    data: {
      name: '노랑이',
      description: '귀여운 노랑이입니다.',
    },
  });

  const yelloInfo = await prisma.characterInfo.createMany({
    data: [
      {
        level: 1,
        expNeed: 0,
        photoUrl: yelloLv1,
        characterId: yello.id,
      },
      {
        level: 2,
        expNeed: 100,
        photoUrl: yelloLv2,
        characterId: yello.id,
      },
      {
        level: 3,
        expNeed: 225,
        photoUrl: yelloLv3,
        characterId: yello.id,
      },
      {
        level: 4,
        expNeed: 375,
        photoUrl: yelloLv4,
        characterId: yello.id,
      },
      {
        level: 5,
        expNeed: 575,
        photoUrl: yelloLv5,
        characterId: yello.id,
      },
    ],
  });

  const green = await prisma.character.create({
    data: {
      name: '초록이',
      description: '귀여운 초록이입니다.',
    },
  });

  const greenInfo = await prisma.characterInfo.createMany({
    data: [
      {
        level: 1,
        expNeed: 0,
        photoUrl: greenLv1,
        characterId: green.id,
      },
      {
        level: 2,
        expNeed: 100,
        photoUrl: greenLv2,
        characterId: green.id,
      },
      {
        level: 3,
        expNeed: 225,
        photoUrl: greenLv3,
        characterId: green.id,
      },
      {
        level: 4,
        expNeed: 375,
        photoUrl: greenLv4,
        characterId: green.id,
      },
      {
        level: 5,
        expNeed: 575,
        photoUrl: greenLv5,
        characterId: green.id,
      },
    ],
  });

  const blue = await prisma.character.create({
    data: {
      name: '파랑이',
      description: '귀여운 파랑이입니다.',
    },
  });

  const blueInfo = await prisma.characterInfo.createMany({
    data: [
      {
        level: 1,
        expNeed: 0,
        photoUrl: blueLv1,
        characterId: blue.id,
      },
      {
        level: 2,
        expNeed: 100,
        photoUrl: blueLv2,
        characterId: blue.id,
      },
      {
        level: 3,
        expNeed: 225,
        photoUrl: blueLv3,
        characterId: blue.id,
      },
      {
        level: 4,
        expNeed: 375,
        photoUrl: blueLv4,
        characterId: blue.id,
      },
      {
        level: 5,
        expNeed: 575,
        photoUrl: blueLv5,
        characterId: blue.id,
      },
    ],
  });

  console.log('Seed data created:');
  console.log('Character:', yello, green, blue);
  console.log('CharacterInfo:', yelloInfo, greenInfo, blueInfo);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
