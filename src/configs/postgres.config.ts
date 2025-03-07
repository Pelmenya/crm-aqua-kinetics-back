import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AccountService } from 'src/modules/service/modules/account-service/account-service.entity';
import { RealEstate } from 'src/modules/client/modules/real-estate/real-estate.entity';
import { User } from 'src/modules/user/user.entity';

export const getPostgresConfig = async (
    configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
    return {
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [
            User,
            RealEstate,
            AccountService
        ],
        synchronize: true,
    };
};
