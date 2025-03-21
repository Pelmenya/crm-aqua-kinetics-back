// top-level-group-display-setting.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class TopLevelGroupDisplaySetting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    groupName: string;

    @Column({ default: false })
    shouldDisplay: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

}
