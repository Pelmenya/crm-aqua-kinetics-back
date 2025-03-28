import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GroupDisplaySetting } from './group-display-setting.entity';

@Injectable()
export class GroupDisplaySettingRepository {
    constructor(
        @InjectRepository(GroupDisplaySetting)
        private readonly settingsRepository: Repository<GroupDisplaySetting>,
    ) { }

    async findAll() {
        return this.settingsRepository.find();
    }

    async findByGroupId(groupId: string) {
        return this.settingsRepository.findOne({ where: { id: groupId } });
    }

    async findByNameAndParentName(groupName: string, parentGroupName:string){
        return this.settingsRepository.findOne({ where: { groupName, parentGroupName } });
    }

    async findManyVisibleByGroupIds(ids: string[]) {
        return this.settingsRepository.find({ where: { id: In(ids), shouldDisplay: true } });
    }

    async updateDisplaySetting(groupId: string, parentGroupName: string | null, shouldDisplay: boolean, groupName: string | null) {
        const setting = await this.findByGroupId(groupId);
        if (setting) {
            setting.shouldDisplay = shouldDisplay;
            setting.parentGroupName = parentGroupName;
            setting.groupName = groupName;
            await this.settingsRepository.save(setting);
        } else {
            const newSetting = this.settingsRepository.create({ id: groupId, parentGroupName, shouldDisplay, groupName });
            await this.settingsRepository.save(newSetting);
        }
    }

    async findVisiblePathNames() {
        const settings = await this.settingsRepository.find({ where: { shouldDisplay: true } });
        return settings.map(setting => {
            const pathNameComponents = [];
            if (setting.parentGroupName) {
                pathNameComponents.push(setting.parentGroupName);
            }
            if (setting.groupName) {
                pathNameComponents.push(setting.groupName);
            }
            return pathNameComponents.join('/');
        }).filter(pathName => pathName.length > 0);
    }

    async getTopLevelGroups(parentGroupName:string): Promise<GroupDisplaySetting[]> {
        // Находим все группы, у которых нет родительской группы
        return this.settingsRepository.find({ where: { parentGroupName, shouldDisplay: true } });
    }
}
