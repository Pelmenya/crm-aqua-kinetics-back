import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, MoreThan } from 'typeorm';
import { CalendarWorkDay } from './calendar-work-day.entity';
import { CreateCalendarWorkDayDto } from './types/create-calendar-work-day.dto';
import { TSuccess } from 'src/types/t-success';

@Injectable()
export class CalendarWorkDayRepository {
    constructor(
        @InjectRepository(CalendarWorkDay)
        private readonly calendarWorkDayRepository: Repository<CalendarWorkDay>,
        private readonly dataSource: DataSource,
    ) { }

    async createCalendarWorkDay(data: CreateCalendarWorkDayDto, accountServiceId: string): Promise<CalendarWorkDay | null> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await queryRunner.manager.query(
                `INSERT INTO "calendar_work_day" ("date", "dayOfWeek", "startHour", "startMinute", "endHour", "endMinute", "accountServiceId")
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT ("date", "accountServiceId") DO NOTHING
                 RETURNING *`,
                [data.date, data.dayOfWeek, data.startHour, data.startMinute, data.endHour, data.endMinute, accountServiceId]
            );

            await queryRunner.commitTransaction();

            return result[0] ? result[0] as CalendarWorkDay : null;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error inserting calendar work day:', error);
            return null;
        } finally {
            await queryRunner.release();
        }
    }

    async findCalendarWorkDaysByAccountServiceId(accountServiceId: string): Promise<CalendarWorkDay[]> {
        return await this.calendarWorkDayRepository.find({
            where: { accountService: { id: accountServiceId }, isDeleted: false },
        });
    }

    async findCalendarWorkDayByDate(accountServiceId: string, date: Date): Promise<CalendarWorkDay | null> {
        return await this.calendarWorkDayRepository.findOne({
            where: { accountService: { id: accountServiceId }, date },
        });
    }

    async updateCalendarWorkDay(workDay: CalendarWorkDay, updateDto: Partial<CreateCalendarWorkDayDto>): Promise<TSuccess> {
        const updatedWorkDay = this.calendarWorkDayRepository.merge(workDay, updateDto);
        await this.calendarWorkDayRepository.save(updatedWorkDay);
        return { success: true };
    }

    async markCalendarWorkDayAsDeleted(workDay: CalendarWorkDay): Promise<TSuccess> {
        workDay.isDeleted = true;
        await this.calendarWorkDayRepository.save(workDay);
        return { success: true };
    }

    async findLastFilledDay(accountServiceId: string): Promise<CalendarWorkDay | null> {
        return await this.calendarWorkDayRepository.findOne({
            where: { accountService: { id: accountServiceId } },
            order: { date: 'DESC' },
        });
    }

    async findDaysOutOfRange(accountServiceId: string, endDate: Date): Promise<CalendarWorkDay[]> {
        // Находим все дни, которые находятся после endDate
        return await this.calendarWorkDayRepository.find({
            where: { accountService: { id: accountServiceId }, date: MoreThan(endDate) },
        });
    }

    async deleteCalendarWorkDay(workDay: CalendarWorkDay): Promise<TSuccess> {
        await this.calendarWorkDayRepository.remove(workDay);
        return { success: true };
    }
}
