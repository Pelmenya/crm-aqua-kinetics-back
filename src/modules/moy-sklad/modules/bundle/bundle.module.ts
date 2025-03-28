import { Module } from '@nestjs/common';
import { BundleService } from './bundle.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { GroupModule } from '../group/group.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        HttpModule,
    ],
    providers: [BundleService],
    exports: [BundleService],
})
export class BundleModule { }
