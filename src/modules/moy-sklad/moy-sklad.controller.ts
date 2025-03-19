import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { MoySkladService } from './moy-sklad.service';
import { Response } from 'express';
import { SearchBaseParams } from 'src/types/search-base-params';
import { ProductDisplaySetting } from './modules/product/product-display-setting.entity';

@Controller('moysklad')
export class MoySkladController {
    constructor(private readonly moySkladService: MoySkladService) { }

    @Get('product')
    async getProducts(@Query() query: SearchBaseParams) {
        return this.moySkladService.getProducts(query);
    }

    @Get('product/:id/images')
    async getProductImages(@Param('id') id: string) {
        return this.moySkladService.getProductImages(id);
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
    async getTopLevelGroups(): Promise<ProductDisplaySetting[]> {
        return this.moySkladService.getTopLevelGroups();
    }
}
