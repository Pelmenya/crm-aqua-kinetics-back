import { Body, Controller, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { UserCreateDto } from '../user/user.create.dto';


@UseGuards(AuthGuard)
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userRepository: UserRepository,
    ) { }
    @Post('init')
    async authorize(@Req() req: Request & User) {

        const initData = await this.authService.validateInitData(req);
        return initData;
    }


    @Put('register')
    async register(@Req() req: Request & User, @Body() body: Partial<UserCreateDto>) {
        const user = req.user;

        console.log(user)
        if (!user) {
            throw new UnauthorizedException('User not authorized');
        }

        // Обновляем данные пользователя
        if (body.email) {
            user.email = body.email;
        }
        if (body.phone) {
            user.phone = body.phone;
        }

        // Устанавливаем is__auth в true, если оба поля заполнены
        if (user.email && user.phone) {
            user.is_auth = true;
        }

        // Сохраняем обновленного пользователя в базе данных
        await this.userRepository.save(user);

        return user;
    }
}