import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TelegrafModule.forRoot({
            token: process.env.BOT_API_KEY,
            // можете указать webhook, если не хотите использовать polling
            launchOptions: {
                webhook: {
                    domain: process.env.HOST,
                    hookPath: '/webhook',
                },
            },
        }),
    ],
    providers: [BotService],
    exports: [BotService],
})
export class BotModule {}
