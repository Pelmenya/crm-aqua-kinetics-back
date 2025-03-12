import { Module } from '@nestjs/common';
import { AccountCalendarRepository } from './account-calendar.repository';
import { AccountCalendarService } from './account-calendar.service';

@Module({
    providers: [AccountCalendarRepository, AccountCalendarService]
})
export class AccountCalendarModule { }
