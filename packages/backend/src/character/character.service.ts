import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CharacterService {
  constructor(private readonly prisma: PrismaService) {}
}
