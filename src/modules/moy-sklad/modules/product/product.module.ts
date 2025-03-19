import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDisplaySettingRepository } from './product-display-setting.repository';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDisplaySetting } from './product-display-setting.entity';
import { ConfigModule } from '@nestjs/config';
import { TopLevelGroupDisplaySettingRepository } from './top-level-group-display-setting.repository';
import { TopLevelGroupDisplaySetting } from './top-level-group-display-setting.entity';

@Module({
    imports: [
        ConfigModule.forRoot(),
        HttpModule,
        TypeOrmModule.forFeature([
            ProductDisplaySetting, 
            TopLevelGroupDisplaySetting
        ])],
    providers: [
        ProductService,
        ProductDisplaySettingRepository,
        TopLevelGroupDisplaySettingRepository,
    ],
    exports: [
        ProductService,
        ProductDisplaySettingRepository,
        TopLevelGroupDisplaySettingRepository,
    ]
})
export class ProductModule { }
