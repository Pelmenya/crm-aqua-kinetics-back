import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CartService } from './cart.service';
import { TCartState } from './types/t-cart-state';
import { TRequestWithUser } from 'src/types/t-request-with-user';

@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    async getCartByUserId(@Req() req: TRequestWithUser): Promise<TCartState> {
        const userId = req.user.id;
        return await this.cartService.getCartByUserId(userId);
    }

    @Post()
    async updateCartState(@Body() cartState: TCartState, @Req() req: TRequestWithUser) {
        const userId = req.user.id;
        return await this.cartService.updateCartState(userId, cartState);
    }
}
