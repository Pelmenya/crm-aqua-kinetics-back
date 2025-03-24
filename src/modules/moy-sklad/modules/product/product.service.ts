import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { SearchBaseParams } from 'src/types/search-base-params';
import { TopLevelGroupDisplaySettingRepository } from '../group/top-level-group-display-setting.repository';

@Injectable()
export class ProductService {
    private readonly apiHost: string;
    private readonly authToken: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly topLevelGroupDisplaySettingRepository: TopLevelGroupDisplaySettingRepository,
    ) {
        this.authToken = this.configService.get<string>('MOY_SKLAD_API_KEY');
        this.apiHost = this.configService.get<string>('MOY_SKLAD_API_HOST');

    }
    async getProducts(params: SearchBaseParams) {
        const { q, limit, offset } = params; // q = fullPathName группы

       const filterQuery = `pathName=${q}`;

        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.apiHost}/entity/product`, {
                    headers: {
                        'Authorization': `Bearer ${this.authToken}`,
                    },
                    params: {
                        limit,
                        offset,
                        filter: filterQuery,
                    },
                }).pipe(
                    catchError((error: AxiosError) => {
                        const message = error.message || 'An error occurred';
                        throw new NotFoundException(message);
                    }),
                ),
            );

            return response.data.rows;
        } catch (error) {
            console.error('Failed to get products:', error);
            throw error;
        }
    }

    async getProductImages(productId: string) {
        const response = await firstValueFrom(
            this.httpService
                .get(`${this.apiHost}/entity/product/${productId}/images`, {
                    headers: {
                        'Authorization': `Bearer ${this.authToken}`,
                    },
                })
                .pipe(
                    catchError((error: AxiosError) => {
                        const message = error.message || 'An error occurred';
                        throw new NotFoundException(message);
                    }),
                ),
        );

        return response.data.rows;
    }

}
