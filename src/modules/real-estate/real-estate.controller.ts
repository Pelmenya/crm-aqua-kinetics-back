import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { RealEstateService } from './real-estate.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateRealEstateDto } from './types/create-real-estate.dto';
import { UpdateRealEstateDto } from './types/update-real-estate.dto';
import { TRequestWithUser } from 'src/types/t-request-with-user';

@UseGuards(AuthGuard)
@Controller('real-estate')
export class RealEstateController {
    constructor(private readonly realEstateService: RealEstateService) { }

    @Post()
    async createRealEstate(@Body() createRealEstateDto: CreateRealEstateDto, @Req() req: TRequestWithUser): Promise<any> {
        const userId = req.user.id;
        return this.realEstateService.createRealEstate(createRealEstateDto, userId);
    }

    @Get()
    async getRealEstatesByUser(@Req() req:TRequestWithUser): Promise<any> {
        const userId = req.user.id;
        return this.realEstateService.getRealEstatesByUser(userId);
    }

    @Get(':id')
    async getRealEstateById(@Param('id') id: number): Promise<any> {
        return this.realEstateService.getRealEstateById(id);
    }

    @Put(':id')
    async updateRealEstate(@Param('id') id: number, @Body() updateRealEstateDto: UpdateRealEstateDto): Promise<any> {
        return this.realEstateService.updateRealEstate(id, updateRealEstateDto);
    }

    @Delete(':id')
    async deleteRealEstate(@Param('id') id: number): Promise<any> {
        return this.realEstateService.deleteRealEstate(id);
    }
}
