import { IsNumber, IsOptional, IsObject, IsString, IsArray, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { TNullable } from 'src/types/t-nullable';
export class WorkDayDto {
    @IsOptional() // Позволяет полю быть null или undefined
    @IsDate() // Проверяет, что значение является датой, если оно не null
    date: Date | null;

    @IsNumber()
    dayOfWeek: number;

    @IsNumber()
    startHour: number;

    @IsNumber()
    startMinute: number;

    @IsNumber()
    endHour: number;

    @IsNumber()
    endMinute: number;
}
export class CreateAccountServiceDto {
    @IsOptional()
    @IsString()
    address: string;

    @IsObject()
    @IsOptional()
    coordinates?: { type: string; coordinates: [number, number] };

    @IsOptional()
    @IsNumber()
    radiusKm?: number;

    @IsOptional()
    @IsString()
    carNumber?: string;

    @IsOptional()
    @IsString()
    carModel?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkDayDto)
    @IsOptional()
    workDays?: WorkDayDto[];
}
