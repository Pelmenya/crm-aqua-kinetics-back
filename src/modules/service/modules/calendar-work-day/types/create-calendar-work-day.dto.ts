import { IsDateString, IsInt, Min, Max, IsOptional, IsBoolean } from 'class-validator';

export class CreateCalendarWorkDayDto {
    @IsDateString()
    date: Date;

    @IsInt()
    @Min(0)
    @Max(6)
    dayOfWeek: number;

    @IsInt()
    @Min(0)
    @Max(23)
    startHour: number;

    @IsInt()
    @Min(0)
    @Max(59)
    startMinute: number;

    @IsInt()
    @Min(0)
    @Max(23)
    endHour: number;

    @IsInt()
    @Min(0)
    @Max(59)
    endMinute: number;

    @IsOptional()
    @IsBoolean()
    isDeleted: boolean;
}
