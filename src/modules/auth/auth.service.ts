import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { validate, parse } from '@telegram-apps/init-data-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private botToken: string;

  constructor(private readonly configService: ConfigService) {
    this.botToken = this.configService.get<string>('BOT_API_KEY');
  }

  async validateInitData(req: Request) {
    const authHeader = req.headers['authorization'] || '';
    const [authType, authData] = authHeader.split(' ');
    if (authType !== 'tma') {
      throw new UnauthorizedException('User not authorized');
    }
//   validate(authData, this.botToken, { expiresIn: 3600 });
    validate(authData, this.botToken);
    return parse(authData);
  }
}
