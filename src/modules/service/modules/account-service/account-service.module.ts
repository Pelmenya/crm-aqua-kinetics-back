import { Module } from '@nestjs/common';
import { AccountServiceService } from './account-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountServiceRepository } from './account-service.repository';
import { AccountService } from './account-service.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([AccountService]),
    ],
    providers: [AccountServiceService, AccountServiceRepository],
    exports: [AccountServiceService, AccountServiceRepository],
})
export class AccountServiceModule { }