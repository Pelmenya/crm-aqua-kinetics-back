import { Injectable } from '@nestjs/common';
import { AccountServiceRepository } from './account-service.repository';
import { AccountService } from './account-service.entity';
import { CreateAccountServiceDto } from './types/create-account-service.dto';
import { User } from '../../../user/user.entity';
import { UpdateAccountServiceDto } from './types/update-account-service.dto';

@Injectable()
export class AccountServiceService {
    constructor(private readonly accountServiceRepository: AccountServiceRepository) { }

    async createOrUpdateAccountService(createAccountServiceDto: CreateAccountServiceDto, userId: number): Promise<AccountService> {
        const existingAccountService = await this.accountServiceRepository.findAccountServiceByUserId(userId);

        if (existingAccountService) {
            // If the account service exists, update it
            return await this.updateAccountService(existingAccountService.id, createAccountServiceDto);
        } else {
            // If it doesn't exist, create a new one
            return await this.createAccountService(createAccountServiceDto, userId);
        }
    }

    private async createAccountService(createAccountServiceDto: CreateAccountServiceDto, userId: number): Promise<AccountService> {
        const { coordinates, carNumber, carModel, address, workDays, calendarMonths } = createAccountServiceDto;
        const accountService = await this.accountServiceRepository.createAccountService({
            coordinates: { type: 'Point', coordinates: coordinates.coordinates },
            carNumber,
            carModel,
            address,
            workDays,
            calendarMonths,
            user: { id: userId } as User,
        });

        return accountService;
    }

    private async updateAccountService(id: string, updateAccountServiceDto: UpdateAccountServiceDto): Promise<AccountService> {
        const { coordinates, carNumber, carModel, address, workDays, calendarMonths } = updateAccountServiceDto;
        return await this.accountServiceRepository.updateAccountService(id, {
            coordinates: coordinates ? { type: 'Point', coordinates: coordinates.coordinates } : undefined,
            carNumber: carNumber ? carNumber : undefined,
            carModel: carModel ? carModel : undefined,
            address: address ? address : undefined,
            workDays: workDays ? workDays : undefined,
            calendarMonths: calendarMonths ? calendarMonths : undefined,
        });
    }

    async getAccountServiceByUserId(userId: number): Promise<AccountService> {
        return await this.accountServiceRepository.findAccountServiceByUserId(userId);
    }

    async deleteAccountService(id: string): Promise<void> {
        await this.accountServiceRepository.deleteAccountService(id);
    }
}
