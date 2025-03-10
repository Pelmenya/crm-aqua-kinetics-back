
import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../user/user.role.guard';
import { AccountServiceService } from './modules/account-service/account-service.service';
import { Roles } from '../user/roles';
import { UserRole } from '../user/user.entity';
import { CreateAccountServiceDto } from './modules/account-service/types/create-account-service.dto';
import { TRequestWithUser } from 'src/types/t-request-with-user';
import { AccountService } from './modules/account-service/account-service.entity';


@UseGuards(AuthGuard, RolesGuard)
@Controller('service')
export class ServiceController { 
    constructor(private readonly accountServiceService: AccountServiceService) { }

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
}