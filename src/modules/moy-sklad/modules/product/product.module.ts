import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { GroupModule } from '../group/group.module';

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
