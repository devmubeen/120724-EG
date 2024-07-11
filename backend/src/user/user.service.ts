import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto, SignInUserDto } from './user.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, name, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, name, password: hashedPassword });
    return user.save();
  }

  async signInUser(signInUserDto: SignInUserDto): Promise<{ token: string; user: User } | null> {
    const { email, password } = signInUserDto;
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ email: user.email, sub: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
      return { token, user };
    }
    return null;
  }
}
