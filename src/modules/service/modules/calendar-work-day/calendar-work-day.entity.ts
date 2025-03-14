import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AccountService } from '../account-service/account-service.entity';

@Entity()
@Unique(['date', 'accountService'])
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

    @Index()
    @ManyToOne(() => AccountService, accountService => accountService.calendarWorkDays, { onDelete: 'CASCADE' })
    accountService: AccountService;

    @Column({ default: false })
    isDeleted: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
