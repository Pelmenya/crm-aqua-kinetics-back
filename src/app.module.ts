import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './modules/bot/bot.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostgresModule } from './modules/postgres/postgres.module';
import { UserModule } from './modules/user/user.module';
import { CommonModule } from './modules/common/common.module';

@Module({
    imports: [BotModule, WebhookModule, AuthModule, PostgresModule, UserModule, CommonModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
