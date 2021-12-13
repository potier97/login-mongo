import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import config from '@configdata/env-config';

const corsConfig: CorsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,POST,DELETE',
  preflightContinue: false,
  // allowedHeaders: ['Content-Type', 'Authorization'],
  allowedHeaders: ['*'],
};

async function bootstrap() {
  const appConfig = config().amq;
  const host = appConfig.url;
  const queue = appConfig.queue;
  //CONFIGURACION DE CONEXION A RABBIT
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [host],
      queue: queue,
      queueOptions: {
        durable: false,
      },
    },
  };

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(microserviceOptions, {
    inheritAppConfig: true,
  });

  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   microserviceOptions,
  // );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // await app.listen();
  await app.startAllMicroservices();

  // CORS
  app.enableCors(corsConfig);

  await app.listen(AppModule.port || 3000);
}
bootstrap();
