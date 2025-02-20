import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './modules/bot/bot.module';
import { WebhookModule } from './modules/webhook/webhook.module';

@Module({
    imports: [BotModule, WebhookModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
