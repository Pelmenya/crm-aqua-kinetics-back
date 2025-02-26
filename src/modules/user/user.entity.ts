import { Entity, Column, PrimaryColumn } from 'typeorm';

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

    @Column({ unique: true })
    email: string; // Уникальный email

    @Column({ nullable: true })
    phone: string;
}
