import { IsString, IsNumber, IsOptional, IsEnum, IsObject } from 'class-validator';

enum ActiveType {
    HOUSE = 'house',
    APARTMENT = 'apartment',
    PROM = 'prom'
}

enum ActiveSource {
    BOREHOLE = 'borehole',
    WELL = 'well',
    RESERVOIR = 'reservoir',
    WATER_SUPPLY = 'waterSupply',
}

export class CreateRealEstateDto {
    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsObject()
    coordinates?: { type: string; coordinates: [number, number] };
    
    @IsObject()
    waterIntakePoints: {
        toilet: number;
        sink: number;
        bath: number;
        washingMachine: number;
        dishWasher: number;
        showerCabin: number;
    };

    @IsEnum(ActiveType)
    activeType: ActiveType;

    @IsNumber()
    residents: number;

    @IsEnum(ActiveSource)
    activeSource: ActiveSource;
}
