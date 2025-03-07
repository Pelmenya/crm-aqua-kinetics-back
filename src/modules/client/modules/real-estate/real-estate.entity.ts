import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../../user/user.entity';

@Entity()
export class RealEstate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    address: string;

    @Column('geometry', { nullable: true, spatialFeatureType: 'Point', srid: 4326 })
    coordinates: { type: 'Point', coordinates: [number, number] };

    @Column('json')
    waterIntakePoints: {
        toilet: number;
        sink: number;
        bath: number;
        washingMachine: number;
        dishWasher: number;
        showerCabin: number;
    };

    @Column()
    activeType: 'house' | 'apartment';

    @Column()
    residents: number;

    @Column()
    activeSource: 'borehole' | 'well' | 'reservoir' | 'waterSupply';

    @ManyToOne(() => User, user => user.realEstate, { nullable: false })
    user: User;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
