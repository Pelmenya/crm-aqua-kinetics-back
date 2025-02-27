
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { validate, parse } from '@telegram-apps/init-data-node';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
    private botToken: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly userRepository: UserRepository, // Подключаем UserService
    ) {
        this.botToken = this.configService.get<string>('BOT_API_KEY');
    }

    async validateInitData(req: Request) {
        const authHeader = req.headers['authorization'] || '';
        const [authType, authData] = authHeader.split(' ');
        if (authType !== 'tma') {
            throw new UnauthorizedException('Invalid authorization type');
        }

        try {
            // Валидация данных
            validate(authData, this.botToken);
            const userData = parse(authData);

            // Попробуем найти пользователя в базе данных
            let user = await this.userRepository.findUserById(Number(userData.user.id));

            // Если пользователь не найден, создаем нового
            if (!user) {
                user = await this.userRepository.createUser({
                    id: userData.user.id,
                    first_name: userData.user.first_name,
                    last_name: userData.user.last_name,
                    username: userData.user.username,
                    photo_url: userData.user.photo_url,
                    language_code: userData.user.language_code,
                    allows_write_to_pm: userData.user.allows_write_to_pm,
                    email: null,
                    phone: null,
                    role: UserRole.CLIENT,  // Назначаем роль по умолчанию
                });

            }

            // Добавляем пользователя в запрос
            req.user = user;

            return user;

        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
