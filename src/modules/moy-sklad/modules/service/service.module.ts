import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        ConfigModule.forRoot(),
        HttpModule,
    ],
    providers: [ServiceService],
    exports: [ServiceService],
})

export class ServiceModule { }
