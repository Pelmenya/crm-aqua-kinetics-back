import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { UserRole } from './user.entity';

export class UserCreateDto {
    @IsBoolean()
    allows_write_to_pm: boolean;

    @IsString()
    first_name: string;

    @IsNumber()
    id: number;

    @IsOptional()
    @IsString()
    last_name?: string;

    @IsString()
    language_code: string;

    @IsUrl()
    photo_url: string;

    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsString()
    role: UserRole;
}
