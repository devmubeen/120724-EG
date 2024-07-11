import { Controller, Post, Body, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, SignInUserDto } from './user.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return { success: true, user };
  }

  @Post('signin')
  async signIn(@Body() signInUserDto: SignInUserDto, @Res() res: Response) {
    const result = await this.userService.signInUser(signInUserDto);
    if (result) {
      const { token, user } = result;
      res.cookie('token', token, { httpOnly: true });
      return res.json({ success: true, user });
    }
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  @Post('signout')
  async logout(@Res() res: Response) {
    res.clearCookie('token');
    return res.json({ success: true, message: 'Logged out successfully' });
  }
}
