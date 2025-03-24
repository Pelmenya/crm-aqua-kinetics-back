import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class BundleService {
    private readonly apiHost: string;
    private readonly authToken: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.authToken = this.configService.get<string>('MOY_SKLAD_API_KEY');
        this.apiHost = this.configService.get<string>('MOY_SKLAD_API_HOST');

    }

    async getBundleImages(bundleId: string) {
        const response = await firstValueFrom(
            this.httpService
                .get(`${this.apiHost}/entity/bundle/${bundleId}/images`, {
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
    async getBundlesByFilter(filter: string) {
        return await firstValueFrom(
            this.httpService.get(`${this.apiHost}/entity/bundle`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                },
                params: {
                    filter,
                },
            }).pipe(
                catchError((error: AxiosError) => {
                    const message = error.message || 'An error occurred';
                    throw new NotFoundException(message);
                }),
            ),
        );

    }
}
