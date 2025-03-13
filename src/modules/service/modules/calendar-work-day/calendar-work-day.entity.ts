import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';
import { AccountService } from '../account-service/account-service.entity';

@Entity()
export class CalendarWorkDay {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column('date')
    date: Date;

    @Column('int')
    dayOfWeek: number;

    @Column('int')
    startHour: number;

    @Column('int')
    startMinute: number;

    @Column('int')
    endHour: number;

    @Column('int')
    endMinute: number;

    @ManyToOne(() => AccountService, accountService => accountService.calendarWorkDays, { onDelete: 'CASCADE' })
    accountService: AccountService;
}
