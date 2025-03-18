import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ProductDisplaySetting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    groupId: string; // Идентификатор группы в МойСклад

    @Column({ nullable: true })
    parentGroupId: string | null; // Идентификатор родительской группы, если есть

    @Column({ nullable: true })
    groupName: string | null; // Имя группы в МойСклад

    @Column({ default: false })
    shouldDisplay: boolean; // По умолчанию скрыты

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
