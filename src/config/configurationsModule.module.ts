import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';

import { Environments } from './environment';
import envConfig from './env-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: Environments[process.env.NODE_ENV] || `.env`,
      load: [envConfig],
      isGlobal: true,
      expandVariables: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        //Conexión a postgress
        MONGO_DB: Joi.string().required(),
        MONGO_USER: Joi.string().required(),
        MONGO_PASSWORD: Joi.string().required(),
        MONGO_PORT: Joi.number().required(),
        MONGO_HOST: Joi.string().required(),
        MONGO_CONNECTION: Joi.string().required(),
        //CONEXION SEGURIDAD
        API_KEY: Joi.string().required(),
        // Conexión a RABITMQ
        AMQP_URL: Joi.string().required(),
        AMQP_QUEUE: Joi.string().required(),
        AMQP_NAME: Joi.string().required(),
      }),
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationsModule {}
