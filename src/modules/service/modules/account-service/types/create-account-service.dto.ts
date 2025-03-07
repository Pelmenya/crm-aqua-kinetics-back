import { IsNumber, IsOptional, IsObject, IsString } from 'class-validator';

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
}
