import { Repository } from 'typeorm';
import { RealEstate } from './real-estate.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RealEstateRepository {
    constructor(
        @InjectRepository(RealEstate)
        private realEstateRepository: Repository<RealEstate>
    ) { }

    async createRealEstate(data: Partial<RealEstate>): Promise<RealEstate> {
        const realEstate = this.realEstateRepository.create(data);
        return await this.realEstateRepository.save(realEstate);
    }

    async findRealEstatesByUser(userId: number): Promise<RealEstate[]> {
        return await this.realEstateRepository.find({ where: { user: { id: userId } } });
    }

    async findRealEstateById(id: number): Promise<RealEstate> {
        return await this.realEstateRepository.findOne({ where: { id } });
    }

    async updateRealEstate(id: number, data: Partial<RealEstate>): Promise<RealEstate> {
        await this.realEstateRepository.update(id, data);
        return this.realEstateRepository.findOne({ where: { id } });
    }

    async deleteRealEstate(id: number): Promise<void> {
        await this.realEstateRepository.delete(id);
    }
}
