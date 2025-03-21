import { Module } from '@nestjs/common';
import { GroupService } from './group.service';

@Module({
  providers: [GroupService]
})
export class GroupModule {}
