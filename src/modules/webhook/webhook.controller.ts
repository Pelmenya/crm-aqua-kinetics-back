import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';

@Controller('webhook')
export class WebhookController {
    constructor(@InjectBot() private readonly bot: Telegraf) {}

    @Post()
    async handleWebhook(@Req() req: Request) {
        await this.bot.handleUpdate(req.body);
        return 'OK';
    }
}
