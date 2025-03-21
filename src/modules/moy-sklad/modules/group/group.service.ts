import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { SearchBaseParams } from 'src/types/search-base-params';
import { GroupDisplaySettingRepository } from './group-display-setting.repository';
import { ConfigService } from '@nestjs/config';
import { TopLevelGroupDisplaySettingRepository } from './top-level-group-display-setting.repository'; // Добавьте импорт
import { SystemBundleEnum, TSystemBundle } from '../bundle/types/t-system-bundle';
import { BundleService } from '../bundle/bundle.service';

@Injectable()
export class GroupService {
    private readonly apiHost: string;
    private readonly authToken: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly groupDisplaySettingRepository: GroupDisplaySettingRepository,
        private readonly topLevelGroupDisplaySettingRepository: TopLevelGroupDisplaySettingRepository, // Добавьте репозиторий
        private readonly bundleService: BundleService,
    ) {
        this.authToken = this.configService.get<string>('MOY_SKLAD_API_KEY');
        this.apiHost = this.configService.get<string>('MOY_SKLAD_API_HOST');

        // Инициализируем настройки при старте приложения
        this.initializeSettings();
    }

    private async initializeSettings() {
        try {
            await this.updateGroupDisplaySettings();
            console.log('Product display settings initialized.');

            // Инициализация верхнеуровневых групп
            await this.initializeTopLevelGroups();
            console.log('Top level groups initialized.');
        } catch (error) {
            console.error('Failed to initialize settings:', error);
        }
    }

    private async initializeTopLevelGroups() {
        const groups = await this.getGroups();
        for (const group of groups) {
            if (!group.pathName) {  // Проверяем, что группа является верхнеуровневой
                await this.topLevelGroupDisplaySettingRepository.saveGroup(group.name);
            }
        }
    }

    async getGroups() {
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

    async updateGroupDisplaySettings() {
        const groups = await this.getGroups();

        for (const group of groups) {
            const existingSetting = await this.groupDisplaySettingRepository.findByGroupId(group.id);

            if (!existingSetting) {
                await this.groupDisplaySettingRepository.updateDisplaySetting(
                    group.id,
                    group.pathName || null, // Сохранение имени родительской группы
                    false, // По умолчанию скрыты
                    group.name || null // Сохранение имени группы
                );
            } else {
                existingSetting.groupName = group.name || existingSetting.groupName;
                await this.groupDisplaySettingRepository.updateDisplaySetting(
                    existingSetting.groupId,
                    existingSetting.parentGroupName,
                    existingSetting.shouldDisplay,
                    existingSetting.groupName
                );
            }
        }
    }

    async getTopLevelGroups() {
        const parentGroupNames = await this.topLevelGroupDisplaySettingRepository.getTopLevelGroups();
        // пока так вручную, при разработке кабинета админа можно настроить.
        const topLevelGroups = await this.groupDisplaySettingRepository.getTopLevelGroups(parentGroupNames[0].groupName);

        return topLevelGroups;
    }

    async getTopLevelGroupsWithBundles() {
        try {
            // Получаем список видимых верхнеуровневых групп
            const topLevelGroups = await this.getTopLevelGroups();

            if (topLevelGroups.length === 0) {
                return [];
            }
            // Для каждой группы получаем её комплекты
            const groupsWithBundles = await Promise.all(
                topLevelGroups.map(async (group) => {
                    const filterQuery = `pathName=${group.parentGroupName + '/' + group.groupName}`; // Фильтрация по pathName
                    const response = await this.bundleService.getBundlesByFilter(filterQuery);
                    return {
                        ...group, // Данные о группе
                        systemBundle: response.data.rows.filter((row: TSystemBundle) => row.name === SystemBundleEnum.NAME)[0] as TSystemBundle, // Комплекты, относящиеся к этой группе
                    };
                })
            );

            return groupsWithBundles;
        } catch (error) {
            console.error('Failed to get top level groups with bundles:', error);
            throw error;
        }
    }


}
