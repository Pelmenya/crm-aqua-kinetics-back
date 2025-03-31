import { Module } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cart]), 
        AuthModule,
    ],
    providers: [CartRepository, CartService],
    controllers: [CartController]
})
export class CartModule { }
