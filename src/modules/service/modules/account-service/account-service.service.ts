import { Injectable } from '@nestjs/common';
import { AccountServiceRepository } from './account-service.repository';
import { AccountService } from './account-service.entity';
import { CreateAccountServiceDto } from './types/create-account-service.dto';
import { UpdateAccountServiceDto } from './types/update-account-service.dto';
import { User } from '../../../user/user.entity';

@Injectable()
export class AccountServiceService {
  constructor(private readonly accountServiceRepository: AccountServiceRepository) {}

  async createAccountService(createAccountServiceDto: CreateAccountServiceDto, userId: number): Promise<AccountService> {
    const { coordinates, radiusKm, carNumber, carModel } = createAccountServiceDto;
    const accountService = await this.accountServiceRepository.createAccountService({
      coordinates: { type: 'Point', coordinates: coordinates.coordinates },
      radiusKm,
      carNumber,
      carModel,
      user: { id: userId } as User,
    });

    return accountService;
  }

  async getAccountServiceByUserId(userId: number): Promise<AccountService> {
    return await this.accountServiceRepository.findAccountServiceByUserId(userId);
  }

  async updateAccountService(id: string, updateAccountServiceDto: UpdateAccountServiceDto): Promise<AccountService> {
    const { coordinates, radiusKm, carNumber, carModel } = updateAccountServiceDto;
    return await this.accountServiceRepository.updateAccountService(id, {
      coordinates: coordinates ? { type: 'Point', coordinates: coordinates.coordinates } : undefined,
      radiusKm,
      carNumber,
      carModel,
    });
  }

  async deleteAccountService(id: string): Promise<void> {
    await this.accountServiceRepository.deleteAccountService(id);
  }
}