import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { AuthModule } from '../auth/auth.module';
import { RealEstateModule } from './modules/real-estate/real-estate.module';

@Module({
    imports: [
        AuthModule, 
        RealEstateModule
    ],
    controllers: [ClientController],

})
export class ClientModule {}
