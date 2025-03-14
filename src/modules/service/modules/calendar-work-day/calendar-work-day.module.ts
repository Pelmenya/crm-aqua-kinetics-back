import { Module } from '@nestjs/common';
import { CalendarWorkDayRepository } from './calendar-work-day.repository';
import { CalendarWorkDayService } from './calendar-work-day.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarWorkDay } from './calendar-work-day.entity';
import { AccountServiceModule } from '../account-service/account-service.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([CalendarWorkDay]),
        AccountServiceModule,
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
