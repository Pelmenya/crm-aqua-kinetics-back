import { IsNumber, IsOptional, IsObject, IsString } from 'class-validator';

export class CreateAccountServiceDto {
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
}
