import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupDisplaySettingRepository } from './group-display-setting.repository';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupDisplaySetting } from './group-display-setting.entity';
import { ConfigModule } from '@nestjs/config';
import { TopLevelGroupDisplaySettingRepository } from './top-level-group-display-setting.repository';
import { TopLevelGroupDisplaySetting } from './top-level-group-display-setting.entity';
import { BundleModule } from '../bundle/bundle.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        HttpModule,
        BundleModule,// т.к. есть системный комплект поэтому внедряем
        TypeOrmModule.forFeature([
            GroupDisplaySetting, 
            TopLevelGroupDisplaySetting
        ])],
    providers: [
        GroupService,
        GroupDisplaySettingRepository,
        TopLevelGroupDisplaySettingRepository,
    ],
    exports: [
        GroupService,
        GroupDisplaySettingRepository,
        TopLevelGroupDisplaySettingRepository,
    ]
})
export class GroupModule { }
