import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { TServiceRes } from './types/t-service-res';

@Injectable()
export class ServiceService {
    private readonly apiHost: string;
    private readonly authToken: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.authToken = this.configService.get<string>('MOY_SKLAD_API_KEY');
        this.apiHost = this.configService.get<string>('MOY_SKLAD_API_HOST');
    }

    async getService(serviceId: string): Promise<TServiceRes> {
        const response = await firstValueFrom(
            this.httpService
                .get(`${this.apiHost}/entity/service/${serviceId}`, {
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

        const { id, name, description, attributes } = response.data
        const rateOfHours = attributes.find((attr: {name: string}) => attr.name === 'Нормо час').value;
        return { id, name, description, rateOfHours };
    }
}
