import { Repository } from 'typeorm';
import { AccountService } from './account-service.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccountServiceRepository {
    constructor(
        @InjectRepository(AccountService)
        private accountServiceRepository: Repository<AccountService>,
    ) { }

    async createAccountService(data: Partial<AccountService>): Promise<AccountService> {
        const accountService = this.accountServiceRepository.create(data);
        return await this.accountServiceRepository.save(accountService);
    }

    async findAccountServiceByUserId(userId: number): Promise<AccountService> {
        return await this.accountServiceRepository.findOne({ where: { user: { id: userId } } });
    }

    async updateAccountService(id: string, data: Partial<AccountService>): Promise<AccountService> {
        await this.accountServiceRepository.update(id, data);
        return this.accountServiceRepository.findOne({ where: { id } });
    }

    async deleteAccountService(id: string): Promise<void> {
        await this.accountServiceRepository.delete(id);
    }
}