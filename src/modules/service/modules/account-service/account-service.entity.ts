import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../user/user.entity';
import { TWorkDay } from 'src/types/t-work-day';

@Entity()
export class AccountService {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    address: string;

    @Column('geometry', { nullable: true, spatialFeatureType: 'Point', srid: 4326 })
    coordinates: { type: 'Point', coordinates: [number, number] };

    @Column({ nullable: true })
    radiusKm: number;

    @Column({ nullable: true })
    carNumber: string;

    @Column({ nullable: true })
    carModel: string;

    @OneToOne(() => User, user => user.accountService, { nullable: true })
    user: User;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    // Упрощенное поле для рабочих дней
    @Column('json', { nullable: true })
    workDays: TWorkDay[];
}
