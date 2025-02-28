import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { TCoordinatesResData, TSuggestionAddressResData } from './proxy.types';
import { AuthGuard } from '../auth/auth.guard';
import { SearchBaseParams } from 'src/types/search-base-params';

@UseGuards(AuthGuard)
@Controller('proxy')
export class ProxyController {
    constructor(private readonly proxyService: ProxyService) { }

    @Get('suggest/address')
    async getSuggestions(
        @Query() query: SearchBaseParams,
    ): Promise<TSuggestionAddressResData> {
        return await this.proxyService.getSuggestions(query.q, query.limit);
    }

    @Get('geocode')
    async getCoordinates(
        @Query('address') address: string,
    ): Promise<TCoordinatesResData> {
        return await this.proxyService.getCoordinates(address);
    }
}
