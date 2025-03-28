import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { SearchBaseParams } from 'src/types/search-base-params';
import { GroupService } from './modules/group/group.service';
import { ProductService } from './modules/product/product.service';
import { BundleService } from './modules/bundle/bundle.service';
import { TProductResponse } from './modules/product/types/t-product-res';
import { ServiceService } from './modules/service/service.service';

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
        private readonly serviceService: ServiceService,
    ) {
        this.authToken = this.configService.get<string>('MOY_SKLAD_API_KEY');
        this.apiHost = this.configService.get<string>('MOY_SKLAD_API_HOST');
    }

    async getSubGroupsByGroupId(id: string, params: SearchBaseParams) {
        const subGroups = await this.groupService.getSubGroupsByGroupId(id, params);
        return await this.groupService.getGroupsWithBundles(subGroups);
    }

    async getGroupPath (id: string){
        return await this.groupService.getGroupPath(id);
    }

    async getProductsByGroupId(id: string, params: SearchBaseParams) {
        const group = await this.groupService.findGroupById(id);
        const q = group.parentGroupName + '/' + group.groupName;
        return await this.productService.getProductsByPathName({ ...params, q });
    }

    async getProduct(id: string): Promise<TProductResponse & { servicesIds: string[] }> {
        // Ищем товар
        const product = await this.productService.getProduct(id);
        // Ищем его группу
        const paths = product.productFolder.meta.href.split('/');
        const groupId = paths[paths.length - 1];
        const group = await this.groupService.findGroupById(groupId);
        // Ищем системный комплект
        const systemBundle = await this.groupService.getGroupBundle(group);
        //Ids Услуг
        const servicesIds = await this.bundleService.getServicesIdsByBundleId(systemBundle.id);
        return { ...product, servicesIds };
    }

    async getService(id: string) {
        const service = await this.serviceService.getService(id);
        return service;
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
        const topLevelGroups = await this.groupService.getTopLevelGroups();
        const groupsWithBundles = await this.groupService.getGroupsWithBundles(topLevelGroups);
        return groupsWithBundles;
    }

    async getTopLevelGroupsProducts(): Promise<any> {
        const parentGroupNames = await this.groupService.getTopLevelGroups();
        // пока так вручную, при разработке кабинета админа можно настроить.
        const products = await this.productService.getProductsByPathName({ q: parentGroupNames[0].groupName });
        return products;
    }
}
