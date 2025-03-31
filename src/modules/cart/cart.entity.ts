// cart.entity.ts
import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { TCartState } from './types/t-cart-state';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, user => user.cart, { nullable: true })
    @JoinColumn()
    user: User;

    @Column('jsonb', { default: {} })
    cartState: TCartState; // Типизированное состояние корзины

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
