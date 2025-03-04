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
        const { coordinates, ...otherData } = createRealEstateDto;
    
        console.log(createRealEstateDto);

        const realEstate = await this.realEstateRepository.createRealEstate({
            ...otherData,
            coordinates: coordinates ? {
                type: 'Point',
                coordinates: coordinates.coordinates
            } : null,
            user: { id: userId } as User
        });
    
        return realEstate;
    }
    
    async getRealEstatesByUser(userId: number): Promise<RealEstate[]> {
        return await this.realEstateRepository.findRealEstatesByUser(userId);
    }

    async getRealEstateById(id: number): Promise<RealEstate> {
        return await this.realEstateRepository.findRealEstateById(id);
    }

    async updateRealEstate(id: number, updateRealEstateDto: UpdateRealEstateDto): Promise<RealEstate> {
        const { coordinates, ...otherData } = updateRealEstateDto;
    
        const updateRealEstate = await this.realEstateRepository.updateRealEstate(id, {
            ...otherData,
            coordinates: coordinates ? {
                type: 'Point',
                coordinates: coordinates.coordinates
            } : null,
        });

        return updateRealEstate;
    }

    async deleteRealEstate(id: number): Promise<void> {
        await this.realEstateRepository.deleteRealEstate(id);
    }
}
