import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { RealEstate } from '../real-estate/real-estate.entity';

export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    CLIENT = 'client',
    SERVICE = 'service',
}
@Entity()
export class User {
    @PrimaryColumn()
    id: number; // ID будет использоваться как Primary Key и будет совпадать с Telegram ID

    @Column()
    allows_write_to_pm: boolean;

    @Column()
    first_name: string;

    @Column({ nullable: true })
    last_name: string;

    @Column()
    language_code: string;

    @Column()
    photo_url: string;

    @Column({ unique: true })
    username: string; // Уникальный username

    @Column({ unique: true, nullable: true })
    email: string; // Уникальный email

    @Column({ default: false })
    email_is_confirm: boolean;

    @Column({ nullable: true })
    phone: string;

    @Column({ default: false })
    phone_is_confirm: boolean;

    @Column({ default: false })
    is_auth: boolean;

    @OneToMany(() => RealEstate, realEstate => realEstate.user, { nullable: true })
    realEstate: RealEstate;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CLIENT,
    })
    role: UserRole;
}