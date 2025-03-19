import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ProductDisplaySetting {
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

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
