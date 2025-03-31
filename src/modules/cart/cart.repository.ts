import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import { TCartState } from './types/t-cart-state';

@Injectable()
export class CartRepository {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
    ) { }

    async getCartByUserId(userId: number): Promise<Cart> {
        return this.cartRepository.findOne({ where: { user: { id: userId } } });
    }

    async saveCartState(userId: number, cartState: TCartState): Promise<Cart> {
        let cart = await this.getCartByUserId(userId);

        if (!cart) {
            cart = this.cartRepository.create({ user: { id: userId }, cartState });
        } else {
            cart.cartState = cartState;
        }

        return this.cartRepository.save(cart);
    }
}
