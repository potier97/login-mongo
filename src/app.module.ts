import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

//Importados
import { ConfigurationsModule } from '@configdata/configurationsModule.module';
import { DatabaseModule } from '@database/database.module';
import { Configuration } from '@configdata/config.keys';
import { ConfigService } from '@nestjs/config';

//Modulos generales
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigurationsModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static port: number;
  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get<number>(Configuration.PORT);
  }
}
