import { Controller, Logger, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';

//Importados
import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import {
  createUserTp,
  getAllUsersTp,
  getUserByIdTp,
  updateUserTp,
  deleteUserTp,
} from '@configdata/path';
import { MongoIdPipe } from 'src/common/mongo-id-pipe/mongo-id.pipe';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private usersService: UsersService) {}

  @MessagePattern(getAllUsersTp)
  async getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UsePipes(new MongoIdPipe())
  @MessagePattern(getUserByIdTp)
  async getOne(id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @MessagePattern(createUserTp)
  async create(body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @MessagePattern(updateUserTp)
  async update(data: any): Promise<User> {
    const id: string = data.id;
    const body: UpdateUserDto = data.body;
    return this.usersService.update(id, body);
  }

  @UsePipes(new MongoIdPipe())
  @MessagePattern(deleteUserTp)
  async delete(id: string): Promise<boolean> {
    return this.usersService.remove(id);
  }

  // @Get()
  // @Roles(Role.ADMIN)
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // get(@Param('id') id: string) {
  //   return this.usersService.findOne(id);
  // }

  // @Post()
  // @Public()
  // create(@Body() payload: CreateUserDto) {
  //   return this.usersService.create(payload);
  // }

  // @Put(':id')
  // @Public()
  // update(@Param('id') id: string, @Body() payload: UpdateUserDto) {
  //   return this.usersService.update(id, payload);
  // }

  // @Delete(':id')
  // @Public()
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(id);
  // }
}
