import { Module } from '@nestjs/common';
import { CalendarWorkDayRepository } from './calendar-work-day.repository';
import { CalendarWorkDayService } from './calendar-work-day.service';

@Module({
    providers: [
        CalendarWorkDayRepository, 
        CalendarWorkDayService
    ]
})
export class CalendarWorkDayModule { }
