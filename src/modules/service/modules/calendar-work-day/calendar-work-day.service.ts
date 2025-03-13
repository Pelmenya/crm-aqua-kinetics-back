import { Injectable } from '@nestjs/common';
import { CalendarWorkDayRepository } from './calendar-work-day.repository';
import { AccountService } from '../account-service/account-service.entity';
import { addDays, eachDayOfInterval } from 'date-fns';
import { CreateCalendarWorkDayDto } from './types/create-calendar-work-day.dto';
import { CalendarWorkDay } from './calendar-work-day.entity';

@Injectable()
export class CalendarWorkDayService {
    constructor(
        private readonly calendarWorkDayRepository: CalendarWorkDayRepository,
    ) { }

    async fillCalendar(accountService: AccountService): Promise<void> {
        const workDays = accountService.workDays;

        if (!workDays || workDays.length === 0) return;

        const today = new Date();
        const oneMonthLater = addDays(today, 60);

        const daysInRange = eachDayOfInterval({ start: today, end: oneMonthLater });

        for (const currentDate of daysInRange) {
            const dayOfWeek = currentDate.getDay();

            const matchingWorkDay = workDays.find(
                (workDay) => workDay.dayOfWeek === dayOfWeek,
            );

            if (matchingWorkDay) {
                // Используем метод для проверки существования дня
                const existingWorkDay = await this.calendarWorkDayRepository.findOneByDateAndAccountServiceId(currentDate, accountService.id);

                if (!existingWorkDay) {
                    const { startHour, startMinute, endHour, endMinute } = matchingWorkDay;
                    const createDto: CreateCalendarWorkDayDto = {
                        date: currentDate,
                        dayOfWeek,
                        startHour,
                        startMinute,
                        endHour,
                        endMinute,
                    };

                    await this.calendarWorkDayRepository.createCalendarWorkDay(createDto, accountService.id);
                }
            }
        }
    }

    async getCalendar(accountServiceId: string): Promise<CalendarWorkDay[]> {
        return this.calendarWorkDayRepository.findCalendarWorkDaysByAccountServiceId(accountServiceId);
    }
}
