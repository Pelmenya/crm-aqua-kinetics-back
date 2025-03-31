import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartRepository } from './cart.repository';
import { Cart } from './cart.entity';
import { TCartState } from './types/t-cart-state';

@Injectable()
export class CartService {
    constructor(
        private cartRepository: CartRepository,
    ) {}

    async getCartByUserId(userId: number): Promise<TCartState> {
        const cart = await this.cartRepository.getCartByUserId(userId);
        return cart ? cart.cartState : { items: {} };
    }

    async updateCartState(userId: number, cartState: TCartState): Promise<Cart> {
        return this.cartRepository.saveCartState(userId, cartState);
    }
}
