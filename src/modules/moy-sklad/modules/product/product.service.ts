import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { SearchBaseParams } from 'src/types/search-base-params';
import { ProductDisplaySettingRepository } from './product-display-setting.repository';
import { ConfigService } from '@nestjs/config';
import { TopLevelGroupDisplaySettingRepository } from './top-level-group-display-setting.repository'; // Добавьте импорт

@Injectable()
export class ProductService {
    private readonly apiHost: string;
    private readonly authToken: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly productDisplaySettingRepository: ProductDisplaySettingRepository,
        private readonly topLevelGroupDisplaySettingRepository: TopLevelGroupDisplaySettingRepository, // Добавьте репозиторий
    ) {
        this.authToken = this.configService.get<string>('MOY_SKLAD_API_KEY');
        this.apiHost = this.configService.get<string>('MOY_SKLAD_API_HOST');

        // Инициализируем настройки при старте приложения
        this.initializeSettings();
    }

    private async initializeSettings() {
        try {
            await this.updateProductDisplaySettings();
            console.log('Product display settings initialized.');

            // Инициализация верхнеуровневых групп
            await this.initializeTopLevelGroups();
            console.log('Top level groups initialized.');
        } catch (error) {
            console.error('Failed to initialize settings:', error);
        }
    }

    private async initializeTopLevelGroups() {
        const groups = await this.getProductGroups();
        for (const group of groups) {
            if (!group.pathName) {  // Проверяем, что группа является верхнеуровневой
                await this.topLevelGroupDisplaySettingRepository.saveGroup(group.name);
            }
        }
    }

    async getProducts(params: SearchBaseParams) {
        const { q, limit, offset } = params;

        // Получаем список видимых верхнеуровневых групп
        const topLevelGroups = await this.topLevelGroupDisplaySettingRepository.findVisibleGroups();

        if (topLevelGroups.length === 0) {
            return [];
        }

        const filterQuery = topLevelGroups.map(group => `pathName=${group.groupName}`).join(';');

        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.apiHost}/entity/product`, {
                    headers: {
                        'Authorization': `Bearer ${this.authToken}`,
                    },
                    params: {
                        search: q,
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
    async getProductGroups() {
        const response = await firstValueFrom(
            this.httpService
                .get(`${this.apiHost}/entity/productfolder`, {
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

    async updateProductDisplaySettings() {
        const groups = await this.getProductGroups();

        for (const group of groups) {
            const existingSetting = await this.productDisplaySettingRepository.findByGroupId(group.id);

            if (!existingSetting) {
                await this.productDisplaySettingRepository.updateDisplaySetting(
                    group.id,
                    group.pathName || null, // Сохранение имени родительской группы
                    false, // По умолчанию скрыты
                    group.name || null // Сохранение имени группы
                );
            } else {
                existingSetting.groupName = group.name || existingSetting.groupName;
                await this.productDisplaySettingRepository.updateDisplaySetting(
                    existingSetting.groupId,
                    existingSetting.parentGroupName,
                    existingSetting.shouldDisplay,
                    existingSetting.groupName
                );
            }
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

    async getTopLevelGroups() {
        const parentGroupNames = await this.topLevelGroupDisplaySettingRepository.getTopLevelGroups();
        // пока так вручную, при разработке кабинета админа можно настроить.
        return await this.productDisplaySettingRepository.getTopLevelGroups(parentGroupNames[0].groupName);
    }
}
