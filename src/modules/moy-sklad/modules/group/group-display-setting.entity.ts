import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, Index } from 'typeorm';

@Entity()
@Index(['groupName', 'parentGroupName'], { unique: true })
export class GroupDisplaySetting {
    @PrimaryColumn({ type: 'uuid' })
    id: string;

    @Column({ nullable: true })
    parentGroupName: string | null;

    @Column({ nullable: true })
    groupName: string | null;

    @Column({ default: false })
    shouldDisplay: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
