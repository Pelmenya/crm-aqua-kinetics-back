import { Controller, Get, Post, Put, Delete, Body, Req, UseGuards, NotFoundException, Param } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../user/user.role.guard';
import { AccountServiceService } from './modules/account-service/account-service.service';
import { Roles } from '../user/roles';
import { UserRole } from '../user/user.entity';
import { CreateAccountServiceDto } from './modules/account-service/types/create-account-service.dto';
import { TRequestWithUser } from 'src/types/t-request-with-user';
import { AccountService } from './modules/account-service/account-service.entity';
import { CalendarWorkDayService } from './modules/calendar-work-day/calendar-work-day.service';
import { CalendarWorkDay } from './modules/calendar-work-day/calendar-work-day.entity';
import { CreateCalendarWorkDayDto } from './modules/calendar-work-day/types/create-calendar-work-day.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('service')
export class ServiceController {
    constructor(
        private readonly accountServiceService: AccountServiceService,
        private readonly calendarWorkDayService: CalendarWorkDayService,
    ) {}

    @Roles(UserRole.SERVICE)
    @Post('account')
    async createAccountService(@Body() createAccountServiceDto: CreateAccountServiceDto, @Req() req: TRequestWithUser): Promise<AccountService> {
        const userId = req.user.id;
        return this.accountServiceService.createOrUpdateAccountService(createAccountServiceDto, userId);
    }

    @Roles(UserRole.SERVICE)
    @Get('account')
    async getAccountServiceByUser(@Req() req: TRequestWithUser): Promise<AccountService> {
        const userId = req.user.id;
        return this.accountServiceService.getAccountServiceByUserId(userId);
    }

    @Roles(UserRole.SERVICE)
    @Delete('account/:id')
    async deleteAccountService(@Param('id') id: string): Promise<void> {
        return this.accountServiceService.deleteAccountService(id);
    }

    @Roles(UserRole.SERVICE)
    @Post('fill-calendar')
    async fillCalendar(@Req() req: TRequestWithUser): Promise<CalendarWorkDay[]> {
        const userId = req.user.id;
        return await this.calendarWorkDayService.fillCalendar(userId);
    }

    @Roles(UserRole.SERVICE)
    @Put('calendar')
    async updateOrCreateCalendarWorkDay(
        @Body() updateDto: Partial<CreateCalendarWorkDayDto>,
        @Req() req: TRequestWithUser
    ): Promise<CalendarWorkDay[]> {
        const userId = req.user.id;
        return await this.calendarWorkDayService.updateOrCreateCalendarWorkDay(updateDto, userId);
    }

    @Roles(UserRole.SERVICE)
    @Delete('calendar')
    async deleteCalendarWorkDay(@Body() updateDto: Partial<CreateCalendarWorkDayDto>, @Req() req: TRequestWithUser): Promise<CalendarWorkDay[]> {
        const userId = req.user.id;
        return await this.calendarWorkDayService.deleteCalendarWorkDay(updateDto, userId);
    }
}
