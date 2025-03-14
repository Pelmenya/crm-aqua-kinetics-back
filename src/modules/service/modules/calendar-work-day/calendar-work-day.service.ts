import { Injectable, NotFoundException } from '@nestjs/common';
import { CalendarWorkDayRepository } from './calendar-work-day.repository';
import { CreateCalendarWorkDayDto } from './types/create-calendar-work-day.dto';
import { CalendarWorkDay } from './calendar-work-day.entity';
import { addDays, eachDayOfInterval } from 'date-fns';
import { AccountServiceService } from '../account-service/account-service.service';

@Injectable()
export class CalendarWorkDayService {
    constructor(
        private readonly calendarWorkDayRepository: CalendarWorkDayRepository,
        private readonly accountServiceService: AccountServiceService,
    ) {}

    async fillCalendar(userId: number): Promise<CalendarWorkDay[]> {
        // Получаем AccountService для данного пользователя
        const accountService = await this.accountServiceService.getAccountServiceByUserId(userId);
        if (!accountService) {
            throw new NotFoundException('Account service not found for this user.');
        }
    
        // Получаем последний заполненный день из базы данных
        const lastFilledDay = await this.calendarWorkDayRepository.findLastFilledDay(accountService.id);
    
        // Определяем текущую дату и конечную дату (через несколько месяцев от текущей даты, согласно accountService.calendarMonths)
        const today = new Date();
        const anyMonthsFromToday = addDays(today, accountService.calendarMonths * 30);
    
        // Если есть последний заполненный день, начинаем с него, иначе – с текущей даты
        const startDate = lastFilledDay && lastFilledDay.date > today ? addDays(lastFilledDay.date, 1) : today;
    
        // Устанавливаем конечную дату заполнения
        const endDate = anyMonthsFromToday;
    
        // Получаем список рабочих дней, определённых для данного AccountService
        const workDays = accountService.workDays;
    
        // Если рабочих дней нет, возвращаем существующие записи календаря
        if (!workDays || workDays.length === 0) {
            return await this.calendarWorkDayRepository.findCalendarWorkDaysByAccountServiceId(accountService.id);
        };

        // Определяем диапазон дней, которые будем заполнять в календаре
        const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });

        // Проходим по каждому дню в диапазоне
        for (const currentDate of daysInRange) {
            const dayOfWeek = currentDate.getDay();
    
            // Поиск подходящего рабочего дня на основе дня недели
            const matchingWorkDay = workDays.find(
                (workDay) => workDay.dayOfWeek === dayOfWeek,
            );

            // Если найден подходящий рабочий день, создаем запись в календаре
            if (matchingWorkDay) {
                try {
                    // Извлекаем параметры начала и конца рабочего дня
                    const { startHour, startMinute, endHour, endMinute } = matchingWorkDay;
    
                    // Создаем DTO для нового рабочего дня
                    const createDto: CreateCalendarWorkDayDto = {
                        date: currentDate,
                        dayOfWeek,
                        startHour,
                        startMinute,
                        endHour,
                        endMinute,
                        isDeleted: false,
                    };

                    // Пытаемся создать новый рабочий день в базе данных
                    await this.calendarWorkDayRepository.createCalendarWorkDay(createDto, accountService.id);
                } catch (error) {
                    // Если возникает ошибка, не связанная с уникальностью (например, день уже существует), выбрасываем её
                    if (error.code !== '23505') {  // Код ошибки уникальности в PostgreSQL
                        throw error;
                    }
                }
            }
        }

        // Находим и "удаляем" все дни, которые выходят за пределы endDate, т.е следующие за ней
        const outOfRangeDays = await this.calendarWorkDayRepository.findDaysOutOfRange(accountService.id, endDate);
        for (const day of outOfRangeDays) {
            await this.calendarWorkDayRepository.markCalendarWorkDayAsDeleted(day);
        }
    
        // Возвращаем все дни календаря для данного AccountService
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
                updateDto.isDeleted = false;
                calendarWorkDay = await this.calendarWorkDayRepository.createCalendarWorkDay(updateDto as CreateCalendarWorkDayDto, accountService.id);
            }
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

        const { success } = await this.calendarWorkDayRepository.markCalendarWorkDayAsDeleted(calendarWorkDay);
        if (success) {
            return await this.calendarWorkDayRepository.findCalendarWorkDaysByAccountServiceId(accountService.id);
        }

        throw new NotFoundException('Calendar work day not deleted');
    }
}
