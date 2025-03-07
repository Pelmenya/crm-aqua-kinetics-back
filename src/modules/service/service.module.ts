import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { AccountServiceModule } from './modules/account-service/account-service.module';
import { ServiceService } from './service.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        AuthModule,
        AccountServiceModule,
    ],
    controllers: [ServiceController],
    providers: [ServiceService]
})
export class ServiceModule { }
