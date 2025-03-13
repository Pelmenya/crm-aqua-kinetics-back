import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarWorkDay } from './calendar-work-day.entity';
import { CreateCalendarWorkDayDto } from './types/create-calendar-work-day.dto';

@Injectable()
export class CalendarWorkDayRepository {
    constructor(
        @InjectRepository(CalendarWorkDay)
        private readonly calendarWorkDayRepository: Repository<CalendarWorkDay>,
    ) { }

    async createCalendarWorkDay(data: CreateCalendarWorkDayDto, accountServiceId: string): Promise<CalendarWorkDay> {
        const calendarWorkDay = this.calendarWorkDayRepository.create({ ...data, accountService: { id: accountServiceId } });
        return await this.calendarWorkDayRepository.save(calendarWorkDay);
    }

    async findCalendarWorkDaysByAccountServiceId(accountServiceId: string): Promise<CalendarWorkDay[]> {
        return await this.calendarWorkDayRepository.find({
            where: { accountService: { id: accountServiceId } },
        });
    }

    async removeCalendarWorkDay(id: string): Promise<void> {
        await this.calendarWorkDayRepository.delete(id);
    }
}
