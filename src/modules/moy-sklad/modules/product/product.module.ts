import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
@Module({
    imports: [
        ConfigModule.forRoot(),
        HttpModule,
    ],    
    providers: [ProductService],
    exports: [
        ProductService,
    ]
})
export class ProductModule { }
