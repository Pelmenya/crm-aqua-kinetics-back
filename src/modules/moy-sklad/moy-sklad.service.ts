import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { SearchBaseParams } from 'src/types/search-base-params';
import { GroupService } from './modules/group/group.service';
import { ProductService } from './modules/product/product.service';
import { BundleService } from './modules/bundle/bundle.service';

@Injectable()
export class MoySkladService {
    private readonly apiHost: string;
    private readonly authToken: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly groupService: GroupService,
        private readonly productService: ProductService,
        private readonly bundleService: BundleService,
    ) {
        this.authToken = this.configService.get<string>('MOY_SKLAD_API_KEY');
        this.apiHost = this.configService.get<string>('MOY_SKLAD_API_HOST');
    }

    async getProducts(params: SearchBaseParams) {
        return await this.productService.getProducts(params);
    }

    async getProductImages(productId: string) {
        return await this.productService.getProductImages(productId);
    }

    async getBundleImages(bundleId: string) {
        return await this.bundleService.getBundleImages(bundleId);
    }

    async downloadImage(imageDownloadHref: string) {
        const response = await firstValueFrom(
            this.httpService
                .get(imageDownloadHref, {
                    headers: {
                        'Authorization': `Bearer ${this.authToken}`,
                    },
                    responseType: 'arraybuffer',
                })
                .pipe(
                    catchError((error: AxiosError) => {
                        const message = error.message || 'An error occurred';
                        throw new NotFoundException(message);
                    }),
                ),
        );

        return response;
    }

    async getTopLevelGroups() {
        return await this.groupService.getTopLevelGroupsWithBundles() 
    }
}
