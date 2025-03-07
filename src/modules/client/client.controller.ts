

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { TRequestWithUser } from 'src/types/t-request-with-user';
import { AuthGuard } from '../auth/auth.guard';
import { RealEstateService } from './modules/real-estate/real-estate.service';
import { CreateRealEstateDto } from './modules/real-estate/types/create-real-estate.dto';
import { UpdateRealEstateDto } from './modules/real-estate/types/update-real-estate.dto';

@UseGuards(AuthGuard)
@Controller('client')
export class ClientController {
    constructor(private readonly realEstateService: RealEstateService) { }

    @Post('real-estate')
    async createRealEstate(@Body() createRealEstateDto: CreateRealEstateDto, @Req() req: TRequestWithUser): Promise<any> {
        const userId = req.user.id;
        return this.realEstateService.createRealEstate(createRealEstateDto, userId);
    }

    @Get('real-estate')
    async getRealEstatesByUser(@Req() req:TRequestWithUser): Promise<any> {
        const userId = req.user.id;
        return this.realEstateService.getRealEstatesByUser(userId);
    }

    @Get('real-estate/:id')
    async getRealEstateById(@Param('id') id: number): Promise<any> {
        return this.realEstateService.getRealEstateById(id);
    }

    @Put('real-estate/:id')
    async updateRealEstate(@Param('id') id: number, @Body() updateRealEstateDto: UpdateRealEstateDto): Promise<any> {
        return this.realEstateService.updateRealEstate(id, updateRealEstateDto);
    }

    @Delete('real-estate/:id')
    async deleteRealEstate(@Param('id') id: number): Promise<any> {
        return this.realEstateService.deleteRealEstate(id);
    }
}
