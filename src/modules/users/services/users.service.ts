import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Cron, CronExpression } from '@nestjs/schedule';

import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findAll() {
    return this.userModel.find().exec();
  }

  //Cron para no desactivar el dyno
  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCron() {
    this.logger.debug('Called every 30 seconds');
  }

  async findOne(id: string) {
    return this.userModel.findById(id);
  }

  async getOrdersByUser(userId: string) {
    const user = await this.findOne(userId);
    return {
      date: new Date(),
      user,
      // products: this.productsService.findAll(),
      products: [],
    };
  }

  async create(data: CreateUserDto) {
    const newModel = new this.userModel(data);
    const hashPassword = await bcrypt.hash(newModel.password, 10);
    newModel.password = hashPassword;
    const model = await newModel.save();
    const { password, ...rta } = model.toJSON();
    return rta;
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, changes: UpdateUserDto) {
    // const newChanges = new this.userModel(changes);
    const newChanges = {
      email: changes.email,
      password: changes.password,
      role: changes.role,
    };
    const hashPassword = await bcrypt.hash(newChanges.password, 10);
    newChanges.password = hashPassword;
    return this.userModel
      .findByIdAndUpdate(id, { $set: newChanges }, { new: true })
      .exec();
  }

  remove(id: string) {
    const result = this.userModel.findById(id);
    if (result) {
      this.userModel.findByIdAndDelete(id);
      return true;
    }
    return false;
  }
}
