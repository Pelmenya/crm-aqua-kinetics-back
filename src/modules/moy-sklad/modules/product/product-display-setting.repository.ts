import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDisplaySetting } from './product-display-setting.entity';

@Injectable()
export class ProductDisplaySettingRepository {
  constructor(
    @InjectRepository(ProductDisplaySetting)
    private readonly settingsRepository: Repository<ProductDisplaySetting>,
  ) {}

  async findAll() {
    return this.settingsRepository.find();
  }

  async findByGroupId(groupId: string) {
    return this.settingsRepository.findOne({ where: { groupId } });
  }

  async updateDisplaySetting(groupId: string, parentGroupId: string | null, shouldDisplay: boolean, groupName: string | null) {
    const setting = await this.findByGroupId(groupId);
    if (setting) {
      setting.shouldDisplay = shouldDisplay;
      setting.parentGroupId = parentGroupId;
      setting.groupName = groupName;
      await this.settingsRepository.save(setting);
    } else {
      const newSetting = this.settingsRepository.create({ groupId, parentGroupId, shouldDisplay, groupName });
      await this.settingsRepository.save(newSetting);
    }
  }

  async findVisibleGroupNames() {
    const settings = await this.settingsRepository.find({ where: { shouldDisplay: true } });
    return settings.map(setting => setting.groupName).filter(name => name !== null);
}
}
