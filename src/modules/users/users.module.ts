import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

//Importados
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    // ProductsModule,
    MongooseModule.forFeature([
      //   {
      //     name: Customer.name,
      //     schema: CustomerSchema,
      //   },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
