// top-level-group-display-setting.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class TopLevelGroupDisplaySetting {
    @PrimaryColumn({ type: 'uuid' }) // Id как в Мой склад
    id: string;

    @Column()
    groupName: string;

    @Column({ default: false })
    shouldDisplay: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

}
