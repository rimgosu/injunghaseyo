import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { Request, Response } from 'express';
import { LRUCache } from 'lru-cache';

/**
 * 로그인 한 유저의 Command 중복 요청을 방지합니다. (10초)
 */
@Injectable()
export class DuplicateRequestMiddleware implements NestMiddleware {
  private lruCache: LRUCache<string, boolean>;

  constructor() {
    this.lruCache = new LRUCache({
      max: 10000,
      ttl: 100,
    });
  }

  private generateRequestKey(req: Request): string {
    const method = req.method;
    const path = req.originalUrl;
    const bearer = req.headers['authorization']?.split(' ')[1] || '';
    const body = JSON.stringify(req.body || {});

    return `${method}:${path}:${body}:${bearer}`;
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'GET') {
      return next();
    }

    const requestKey = this.generateRequestKey(req);

    if (this.lruCache.has(requestKey)) {
      return res.status(429).json({
        statusCode: 429,
        message: '중복 요청이 감지되었습니다. 잠시 후 다시 시도해주세요.',
      });
    }

    this.lruCache.set(requestKey, true);

    next();
  }
}
