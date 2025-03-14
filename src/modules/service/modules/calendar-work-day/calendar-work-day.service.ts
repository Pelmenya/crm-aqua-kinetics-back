import { Injectable, NotFoundException } from '@nestjs/common';
import { CalendarWorkDayRepository } from './calendar-work-day.repository';
import { CreateCalendarWorkDayDto } from './types/create-calendar-work-day.dto';
import { CalendarWorkDay } from './calendar-work-day.entity';
import { addDays, eachDayOfInterval } from 'date-fns';
import { TSuccess } from 'src/types/t-success';
import { AccountServiceService } from '../account-service/account-service.service';

@Injectable()
export class CalendarWorkDayService {
    constructor(
        private readonly calendarWorkDayRepository: CalendarWorkDayRepository,
        private readonly accountServiceService: AccountServiceService,
    ) {}

    async fillCalendar(userId: number): Promise<CalendarWorkDay[]> {
        const accountService = await this.accountServiceService.getAccountServiceByUserId(userId);
        if (!accountService) {
            throw new NotFoundException('Account service not found for this user.');
        }

        const workDays = accountService.workDays;

        if (!workDays || workDays.length === 0) return [];

        const today = new Date();
        const twoMonthLater = addDays(today, 60);

        const daysInRange = eachDayOfInterval({ start: today, end: twoMonthLater });

        for (const currentDate of daysInRange) {
            const dayOfWeek = currentDate.getDay();

            const matchingWorkDay = workDays.find(
                (workDay) => workDay.dayOfWeek === dayOfWeek,
            );

            if (matchingWorkDay) {
                try {
                    const { startHour, startMinute, endHour, endMinute } = matchingWorkDay;
                    const createDto: CreateCalendarWorkDayDto = {
                        date: currentDate,
                        dayOfWeek,
                        startHour,
                        startMinute,
                        endHour,
                        endMinute,
                        isDelete: false,
                    };

                    await this.calendarWorkDayRepository.createCalendarWorkDay(createDto, accountService.id);
                } catch (error) {
                    if (error.code !== '23505') {
                        throw error;
                    }
                }
            }
        }
        return await this.calendarWorkDayRepository.findCalendarWorkDaysByAccountServiceId(accountService.id);
    }

    async updateOrCreateCalendarWorkDay(updateDto: Partial<CreateCalendarWorkDayDto>, userId: number): Promise<CalendarWorkDay[]> {
        const accountService = await this.accountServiceService.getAccountServiceByUserId(userId);

        if (!accountService) {
            throw new NotFoundException('Account service not found for this user.');
        }

        let calendarWorkDay = await this.calendarWorkDayRepository.findCalendarWorkDayByDate(accountService.id, updateDto.date);
        if (!calendarWorkDay) {
            // Если день не найден, создаем его
            if (typeof updateDto.date === 'string') {
                updateDto.date = new Date(updateDto.date);
                updateDto.dayOfWeek = updateDto.date.getDay();
                updateDto.isDelete = false;
            }
            calendarWorkDay = await this.calendarWorkDayRepository.createCalendarWorkDay(updateDto as CreateCalendarWorkDayDto, accountService.id);
        } else {
            // Обновляем существующий день
            const { success } = await this.calendarWorkDayRepository.updateCalendarWorkDay(calendarWorkDay, updateDto);

            if (!success) {
                throw new NotFoundException('Calendar work day not updated');
            }
        }

        return await this.calendarWorkDayRepository.findCalendarWorkDaysByAccountServiceId(accountService.id);
    }

    async deleteCalendarWorkDay(updateDto: Partial<CreateCalendarWorkDayDto>, userId: number): Promise<CalendarWorkDay[]> {
        const accountService = await this.accountServiceService.getAccountServiceByUserId(userId);

        if (!accountService) {
            throw new NotFoundException('Account service not found for this user.');
        }

        const calendarWorkDay = await this.calendarWorkDayRepository.findCalendarWorkDayByDate(accountService.id, updateDto.date);
        if (!calendarWorkDay) {
            throw new NotFoundException('Calendar work day not found for this date.');
        }

        const { success } = await this.calendarWorkDayRepository.markCalendarWorkDayAsDeleted(calendarWorkDay.id);
        if (success) {
            return await this.calendarWorkDayRepository.findCalendarWorkDaysByAccountServiceId(accountService.id);
        }

        throw new NotFoundException('Calendar work day not deleted');
    }
}
