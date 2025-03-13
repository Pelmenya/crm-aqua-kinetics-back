import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CalendarWorkDay } from './calendar-work-day.entity';
import { CreateCalendarWorkDayDto } from './types/create-calendar-work-day.dto';

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
            where: { accountService: { id: accountServiceId } },
        });
    }

    async removeCalendarWorkDay(id: string): Promise<void> {
        await this.calendarWorkDayRepository.delete(id);
    }
}
