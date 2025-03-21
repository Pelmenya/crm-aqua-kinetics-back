import { Module } from '@nestjs/common';
import { BundleService } from './bundle.service';

@Module({
  providers: [BundleService]
})
export class BundleModule {}
