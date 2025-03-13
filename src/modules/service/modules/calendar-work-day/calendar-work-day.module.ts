import { Module } from '@nestjs/common';
import { CalendarWorkDayRepository } from './calendar-work-day.repository';
import { CalendarWorkDayService } from './calendar-work-day.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarWorkDay } from './calendar-work-day.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CalendarWorkDay]),
    ],
    providers: [
        CalendarWorkDayRepository,
        CalendarWorkDayService
    ],
    exports: [
        CalendarWorkDayRepository,
        CalendarWorkDayService
    ],
})
export class CalendarWorkDayModule { }
