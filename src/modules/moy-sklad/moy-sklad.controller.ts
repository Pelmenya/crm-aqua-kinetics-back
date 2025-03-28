import { Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { MoySkladService } from './moy-sklad.service';
import { Response } from 'express';
import { SearchBaseParams } from 'src/types/search-base-params';
import { GroupDisplaySetting } from './modules/group/group-display-setting.entity';

@Controller('moysklad')
export class MoySkladController {
    constructor(private readonly moySkladService: MoySkladService) { }

    @Get('group/:id/products')
    async getProducts(@Param('id') id: string, @Query() query: SearchBaseParams) {
        return this.moySkladService.getProductsByGroupId(id, query);
    }

    @Get('group/:id/groups')
    async getGroups(@Param('id') id: string, @Query() query: SearchBaseParams) {
        return await this.moySkladService.getSubGroupsByGroupId(id, query);
    }

    @Get('group/:id/path')
    async getGroupPath(@Param('id') id: string) {
        console.log(id)
        return await this.moySkladService.getGroupPath(id);
    }

    @Get('product/:id/images')
    async getProductImages(@Param('id') id: string) {
        return this.moySkladService.getProductImages(id);
    }

    @Get('product/:id')
    async getProduct(@Param('id') id: string) {
        return this.moySkladService.getProduct(id);
    }

    @Get('service/:id')
    async getService(@Param('id') id: string) {
        return this.moySkladService.getService(id);
    }

    @Get('bundle/:id/images')
    async getBundleImages(@Param('id') id: string) {
        return this.moySkladService.getBundleImages(id);
    }

    @Get('image')
    async downloadImage(@Query('href') href: string, @Res() res: Response) {
        const imageResponse = await this.moySkladService.downloadImage(href);

        // Извлекаем тип контента из заголовков ответа от API
        const contentType = imageResponse.headers['content-type'];

        // Устанавливаем соответствующий тип контента
        res.set('Content-Type', contentType);
        res.send(imageResponse.data);
    }

    @Get('top-level-groups')
    async getTopLevelGroups(): Promise<GroupDisplaySetting[]> {
        return await this.moySkladService.getTopLevelGroups();
    }

    @Get('top-level-groups-products')
    async getTopLevelGroupsProducts(): Promise<GroupDisplaySetting[]> {
        return await this.moySkladService.getTopLevelGroupsProducts();
    }
}
