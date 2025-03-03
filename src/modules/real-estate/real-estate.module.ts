import { Module } from '@nestjs/common';
import { RealEstateController } from './real-estate.controller';
import { RealEstateService } from './real-estate.service';
import { AuthModule } from '../auth/auth.module';
import { RealEstateRepository } from './real-estate.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealEstate } from './real-estate.entity';

@Module({
    imports: [
        AuthModule, 
        TypeOrmModule.forFeature([RealEstate]),
    ],
    controllers: [RealEstateController],
    providers: [RealEstateService, RealEstateRepository],
    exports: [RealEstateService, RealEstateRepository]
})
export class RealEstateModule { }
