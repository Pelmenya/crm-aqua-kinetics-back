import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { GroupDisplaySettingRepository } from './group-display-setting.repository';
import { ConfigService } from '@nestjs/config';
import { TopLevelGroupDisplaySettingRepository } from './top-level-group-display-setting.repository'; // Добавьте импорт
import { SystemBundleEnum, TSystemBundle } from '../bundle/types/t-system-bundle';
import { BundleService } from '../bundle/bundle.service';
import * as cron from 'node-cron';
import { limiter } from '../../helpers/limiter';
import { SearchBaseParams } from 'src/types/search-base-params';
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

        // Устанавливаем cron-задачу для инициализации каждые 10 минут, уберем в кнопку админа
        cron.schedule('*/10 * * * *', () => {
            this.initializeSettings();
        });
    }

    private async initializeSettings() {
        try {
            //Инициализация верхнеуровневых групп
            await this.updateOrCreateTopLevelGroup();
            console.log('Top level groups initialized.');
            await this.updateOrCreateGroupDisplaySettings();
            console.log('Product display settings initialized.');
        } catch (error) {
            console.error('Failed to initialize settings:', error);
        }
    }

    private async updateOrCreateTopLevelGroup() {
        const groups = await this.getAllGroups();

        const initializePromises = groups.map((group) => {
            return limiter.schedule(async () => {
                if (!group.pathName) { // Проверяем, что группа является верхнеуровневой
                    const bundle = await this.bundleService.getBundlesByFilter(`pathName=${group.name}`);
                    const shouldDisplayAttr = bundle.data.rows
                        ?.filter((row: TSystemBundle) => row.name === SystemBundleEnum.NAME)[0]
                        ?.attributes
                        ?.find((attr: { name: string }) => attr.name === SystemBundleEnum.IS_VISIBLE_FOR_APP);

                    if (shouldDisplayAttr) {
                        const existingGroup = await this.topLevelGroupDisplaySettingRepository.findVisibleGroup();

                        if (!existingGroup || existingGroup.groupName !== group.name) {
                            // Обновляем только если группа не существует или отличается от текущей
                            await this.topLevelGroupDisplaySettingRepository.saveGroup(group.name, group.id, true);
                        }
                    }
                }
            });
        });

        await Promise.all(initializePromises);
    }

    async getAllGroups() {
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

    async findGroupById(groupId: string) {
        return await this.groupDisplaySettingRepository.findByGroupId(groupId);
    }

    async getSubGroupsByGroupId(id: string, params: SearchBaseParams) {
        const { limit, offset } = params;

        const group = await this.findGroupById(id);

        const filterQuery = `pathName=${group.parentGroupName + '/' + group.groupName}`;

        const response = await firstValueFrom(
            this.httpService
                .get(`${this.apiHost}/entity/productfolder`, {
                    headers: {
                        'Authorization': `Bearer ${this.authToken}`,
                    },
                    params: {
                        limit,
                        offset,
                        filter: filterQuery,
                    }
                })
                .pipe(
                    catchError((error: AxiosError) => {
                        const message = error.message || 'An error occurred';
                        throw new NotFoundException(message);
                    }),
                ),
        );
        return await this.groupDisplaySettingRepository.findManyByGroupIds(response.data.rows.map(item => item.id));
    }

    async updateOrCreateGroupDisplaySettings() {
        const topLevelGroup = await this.topLevelGroupDisplaySettingRepository.findVisibleGroup();
        const groups = await this.getAllGroups();

        const filterGroups = groups.filter(group =>
            group.pathName.startsWith(`${topLevelGroup.groupName}`)
        );

        const updatePromises = filterGroups.map((group) => {
            return limiter.schedule(async () => {
                const bundle = await this.bundleService.getBundlesByFilter(`pathName= ${group.pathName}/${group.name}`);
                const shouldDisplayAttr = bundle.data.rows
                    ?.filter((row: TSystemBundle) => row.name === SystemBundleEnum.NAME)[0]
                    ?.attributes
                    ?.find((attr: { name: string }) => attr.name === SystemBundleEnum.IS_VISIBLE_FOR_APP);

                if (shouldDisplayAttr) {
                    const existingGroupSetting = await this.groupDisplaySettingRepository.findByGroupId(group.id);

                    if (existingGroupSetting) {
                        await this.groupDisplaySettingRepository.updateDisplaySetting(
                            group.id,
                            group.pathName || null,
                            shouldDisplayAttr.value,
                            group.name || null
                        );
                    } else {
                        await this.groupDisplaySettingRepository.updateDisplaySetting(
                            group.id,
                            group.pathName || null,
                            shouldDisplayAttr.value,
                            group.name || null
                        );
                    }
                }
            });
        });

        await Promise.all(updatePromises);
    }

    async getTopLevelGroups() {
        const parentGroupNames = await this.topLevelGroupDisplaySettingRepository.getTopLevelGroup();
        const topLevelGroups = await this.groupDisplaySettingRepository.getTopLevelGroups(parentGroupNames.groupName);
        return topLevelGroups;
    }

    async getGroupsWithBundles(topLevelGroups: GroupDisplaySetting[]) {
        try {
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

    async getGroupBundle(group: GroupDisplaySetting) {
        try {
            const filterQuery = `pathName=${group.parentGroupName + '/' + group.groupName}`; // Фильтрация по pathName
            const response = await this.bundleService.getBundlesByFilter(filterQuery);
            const bundle: TSystemBundle = response.data.rows.filter((row: TSystemBundle) => row.name === SystemBundleEnum.NAME)[0];
            return bundle // Комплект, относящиеся к этой группе
        } catch (error) {
            console.error('Failed to get top level groups with bundles:', error);
            throw error;
        }
    }

}
