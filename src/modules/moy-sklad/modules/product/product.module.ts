import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDisplaySettingRepository } from './product-display-setting.repository';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDisplaySetting } from './product-display-setting.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        HttpModule,
        TypeOrmModule.forFeature([ProductDisplaySetting])],
    providers: [
        ProductService,
        ProductDisplaySettingRepository
    ],
    exports: [
        ProductService,
        ProductDisplaySettingRepository
    ]
})
export class ProductModule { }
