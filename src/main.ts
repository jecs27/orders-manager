import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('HTTP');

  app.enableCors(
    {
      origin: '*'
    }
  );

  app.use(helmet({
    contentSecurityPolicy: false,
    referrerPolicy: false,
    xssFilter: false,
    xContentTypeOptions: false,
    xDownloadOptions: false,
    dnsPrefetchControl: false,
  }));

  app.use(compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
  }));

  app.use((req, res, next) => {
    logger.log(`${req.method} ${req.originalUrl}`);
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});
