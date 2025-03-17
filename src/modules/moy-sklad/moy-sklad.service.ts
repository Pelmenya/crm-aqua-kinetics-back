import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { SearchBaseParams } from 'src/types/search-base-params';

@Injectable()
export class MoySkladService {
  private readonly apiHost: string;
  private readonly authToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authToken = this.configService.get<string>('MOY_SKLAD_API_KEY');
    this.apiHost = this.configService.get<string>('MOY_SKLAD_API_HOST');
  }

  async getProducts(params: SearchBaseParams) {
    const { q, limit, offset } = params;
    const response = await firstValueFrom(
      this.httpService
        .get(`${this.apiHost}/entity/product`, {
          headers: {
            'Authorization': `Bearer ${this.authToken}`,
          },
          params: {
            search: q,
            limit,
            offset,
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
}
