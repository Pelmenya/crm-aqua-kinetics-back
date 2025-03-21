import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class GroupDisplaySetting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    groupId: string; // Идентификатор группы в МойСклад

    @Column({ nullable: true })
    parentGroupName: string | null; // Имя родительской группы, если есть

    @Column({ nullable: true })
    groupName: string | null; // Имя группы в МойСклад

    @Column({ default: false })
    shouldDisplay: boolean; // По умолчанию скрыты

    @Column({ default: true })
    shouldDisplayBundles: boolean; // По умолчанию отображаются

    @Column({ default: true })
    shouldDisplayServices: boolean; // По умолчанию отображаются

    @Column({ default: true })
    shouldDisplayProducts: boolean; // По умолчанию отображаются

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
