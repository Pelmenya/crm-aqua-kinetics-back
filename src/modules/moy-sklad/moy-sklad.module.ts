import { Module } from '@nestjs/common';
import { MoySkladService } from './moy-sklad.service';
import { MoySkladController } from './moy-sklad.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ServiceModule } from './modules/service/service.module';
import { BundleModule } from './modules/bundle/bundle.module';
import { GroupModule } from './modules/group/group.module';
import { ProductModule } from './modules/product/product.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        HttpModule, 
        GroupModule, 
        BundleModule, 
        ProductModule,
        ServiceModule, 
    ],
    providers: [
        MoySkladService,
    ],
    controllers: [MoySkladController]
})
export class MoySkladModule { }
