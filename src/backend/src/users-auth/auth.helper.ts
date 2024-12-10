import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

const SALT_LENGTH = 16;
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

export function generateVerificationCode(): string {
  const code = Math.floor(Math.random() * 1000000);
  return code.toString().padStart(6, '0');
}

export async function hashPassword(password: string): Promise<{
  hashedPassword: string;
  salt: string;
}> {
  if (!password)
    throw new BadRequestException('비밀번호는 공백을 허용하지 않는다.');
  const salt = crypto.randomBytes(SALT_LENGTH);

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      ITERATIONS,
      KEY_LENGTH,
      DIGEST,
      (err, derivedKey) => {
        if (err) reject(err);
        resolve({
          hashedPassword: derivedKey.toString('hex'),
          salt: salt.toString('hex'),
        });
      },
    );
  });
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
  salt: string,
): Promise<boolean> {
  const saltBuffer = Buffer.from(salt, 'hex');

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      saltBuffer,
      ITERATIONS,
      KEY_LENGTH,
      DIGEST,
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex') === hashedPassword);
      },
    );
  });
}
