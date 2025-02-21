import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UseGuards(AuthGuard)
  async authorize(@Req() req: Request) {
    const initData = await this.authService.validateInitData(req);
    return initData;
  }
}