import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from '../../../user/user.entity';

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
}