import { Module } from '@nestjs/common';
import { MoySkladService } from './moy-sklad.service';
import { MoySkladController } from './moy-sklad.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ProductModule } from './modules/product/product.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        HttpModule, 
        ProductModule,
    ],
    providers: [
        MoySkladService,
    ],
    controllers: [MoySkladController]
})
export class MoySkladModule { }
