// top-level-group-display-setting.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TopLevelGroupDisplaySetting } from './top-level-group-display-setting.entity';

@Injectable()
export class TopLevelGroupDisplaySettingRepository {
    constructor(
        @InjectRepository(TopLevelGroupDisplaySetting)
        private readonly settingsRepository: Repository<TopLevelGroupDisplaySetting>,
    ) { }

    async findVisibleGroup() {
        return this.settingsRepository.findOne({ where: { shouldDisplay: true } });
    }

    async clearGroups() {
        await this.settingsRepository.delete({});
    }

    async saveGroup(groupName: string, groupId: string, shouldDisplay: boolean) {
        const existingGroup = await this.settingsRepository.findOne({ where: { groupName } });
        if (!existingGroup) {
            const newGroup = this.settingsRepository.create({ groupName, id: groupId, shouldDisplay });
            await this.settingsRepository.save(newGroup);
        }
    }

    async getTopLevelGroups(): Promise<TopLevelGroupDisplaySetting[]> {
        return this.settingsRepository.find({ where: { shouldDisplay: true } });
    }

}
