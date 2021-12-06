import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import envConfig from '@configdata/env-config';
// console.log(process.env.NODE_ENV);

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [envConfig.KEY],
      useFactory: (configService: ConfigType<typeof envConfig>) => {
        const { connection, dbName, host, password, user } =
          configService.mongo;
        return {
          uri: `${connection}://${host}`,
          user,
          pass: password,
          dbName,
        };
      },
    }),
  ],
  providers: [],
  exports: [MongooseModule],
})
export class DatabaseModule {}
