import { INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customSiteTitle: 'API Documentation',
};

const swaggerConfig = new DocumentBuilder()
  .setTitle('API 문서')
  .setDescription('NestJS로 만든 API 문서입니다.')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'jwt',
  )
  .build();

export const setupSwagger = (app: INestApplication): void => {
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  if (process.env.NODE_ENV === 'sdk') {
    const sdkDir = path.join(process.cwd(), './sdk');
    if (!fs.existsSync(sdkDir)) {
      fs.mkdirSync(sdkDir);
    }
    const outputPath = path.join(sdkDir, 'swagger.json');
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2), 'utf8');
    console.log('Swagger JSON generated at:', outputPath);
    app.close();
    process.exit(0);
  }

  SwaggerModule.setup('docs', app, document, swaggerCustomOptions);
};
