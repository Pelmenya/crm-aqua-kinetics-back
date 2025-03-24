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
import * as cron from 'node-cron';
import { GroupDisplaySetting } from './group-display-setting.entity';

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

        // Устанавливаем cron-задачу для инициализации каждые 10 минут
        cron.schedule('*/10 * * * *', () => {
            this.initializeSettings();
        });
    }

    private async initializeSettings() {
        try {
            //Инициализация верхнеуровневых групп
            await this.initializeTopLevelGroups();
            console.log('Top level groups initialized.');
            await this.updateGroupDisplaySettings();
            console.log('Product display settings initialized.');
        } catch (error) {
            console.error('Failed to initialize settings:', error);
        }
    }

    private async initializeTopLevelGroups() {
        const groups = await this.getGroups();
        for (const group of groups) {
            if (!group.pathName) {  // Проверяем, что группа является верхнеуровневой
                const bundle = await this.bundleService.getBundlesByFilter(`pathName=${group.name}`);
                if (
                    bundle.data.rows
                        ?.filter((row: TSystemBundle) => row.name === SystemBundleEnum.NAME)[0]
                        ?.attributes
                        ?.filter((attr: { name: string }) => attr.name === SystemBundleEnum.IS_VISIBLE_FOR_APP)) {
                    await this.topLevelGroupDisplaySettingRepository.clearGroups();
                    await this.topLevelGroupDisplaySettingRepository.saveGroup(group.name, group.id, true);
                    break; // найдет первую топ-группу и сохранит только ее
                }
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
        const topLevelGroup = await this.topLevelGroupDisplaySettingRepository.findVisibleGroup();
        const groups = await this.getGroups();

        //фильтруем по top-level группе
        const filterGroups = groups.filter(group => 
            group.pathName.startsWith(`${topLevelGroup.groupName}`)
        );
        await this.groupDisplaySettingRepository.clearGroups();
        for (const group of filterGroups) {
            // есть комплект и атрибут SystemBundleEnum.IS_VISIBLE_FOR_APP value = true
            const bundle = await this.bundleService.getBundlesByFilter(`pathName= ${group.pathName}/${group.name}`);
            if (
                bundle.data.rows
                    ?.filter((row: TSystemBundle) => row.name === SystemBundleEnum.NAME)[0]
                    ?.attributes
                    ?.filter((attr: { name: string }) => attr.name === SystemBundleEnum.IS_VISIBLE_FOR_APP)[0].value) {
                await this.groupDisplaySettingRepository.updateDisplaySetting(
                    group.id,
                    group.pathName || null, // Сохранение имени родительской группы
                    true, // По умолчанию скрыты
                    group.name || null // Сохранение имени группы
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
