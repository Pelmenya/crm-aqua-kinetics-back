import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../../../user/user.entity';
import { TWorkDay } from 'src/types/t-work-day';
import { CalendarWorkDay } from '../calendar-work-day/calendar-work-day.entity';

@Entity()
export class AccountService {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    address: string;

    @Column('geometry', { nullable: true, spatialFeatureType: 'Point', srid: 4326 })
    coordinates: { type: 'Point', coordinates: [number, number] };

    @Column({ nullable: true })
    carNumber: string;

    @Column({ nullable: true })
    carModel: string;

    @OneToOne(() => User, user => user.accountService, { nullable: true })
    user: User;

    // Матрица для рабочих дней
    @Column('json', { nullable: true })
    workDays: TWorkDay[];

    @Column({ nullable: true })
    calendarMonths: number;

    @OneToMany(() => CalendarWorkDay, calendarWorkDay => calendarWorkDay.accountService)
    calendarWorkDays: CalendarWorkDay[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
