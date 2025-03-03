import { Injectable } from '@nestjs/common';
import { RealEstateRepository } from './real-estate.repository';
import { RealEstate } from './real-estate.entity';
import { User } from '../user/user.entity';
import { CreateRealEstateDto } from './types/create-real-estate.dto';
import { UpdateRealEstateDto } from './types/update-real-estate.dto';

@Injectable()
export class RealEstateService {
    constructor(private readonly realEstateRepository: RealEstateRepository) {}

    async createRealEstate(createRealEstateDto: CreateRealEstateDto, userId: number): Promise<RealEstate> {
        const realEstate = new RealEstate();
        Object.assign(realEstate, createRealEstateDto);
        // Устанавливаем `user` с объектом, содержащим только `id`
        realEstate.user = { id: userId } as User;
        
        return await this.realEstateRepository.createRealEstate(realEstate);
    }

    async getRealEstatesByUser(userId: number): Promise<RealEstate[]> {
        return await this.realEstateRepository.findRealEstatesByUser(userId);
    }

    async getRealEstateById(id: number): Promise<RealEstate> {
        return await this.realEstateRepository.findRealEstateById(id);
    }

    async updateRealEstate(id: number, updateRealEstateDto: UpdateRealEstateDto): Promise<RealEstate> {
        return await this.realEstateRepository.updateRealEstate(id, updateRealEstateDto);
    }

    async deleteRealEstate(id: number): Promise<void> {
        await this.realEstateRepository.deleteRealEstate(id);
    }
}
