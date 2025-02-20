import { Injectable } from '@nestjs/common';
import { wrap } from 'module';
import { Action, Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';

@Update()
@Injectable()
export class BotService {
    @Start()
    async onStart(@Ctx() ctx: Context) {
        await ctx.telegram.setMyCommands([
            { command: 'start', description: 'Запустить бота' },
            { command: 'help', description: 'Получить список команд' },
            { command: 'info', description: 'Получить информацию' },
            { command: 'send_photo', description: 'Отправить изображение' },
            { command: 'send_audio', description: 'Отправить аудио' },
            { command: 'send_voice', description: 'Отправить голосовое сообщение' },
        ]);

        await ctx.reply(
            'Добро пожаловать! Используйте меню команд для начала.',
            Markup.inlineKeyboard([
                [Markup.button.callback('Контакты', 'contacts')],
                [Markup.button.callback('Цены', 'prices')],
                [Markup.button.callback('Отправить изображение', 'send_photo')],
                [Markup.button.callback('Отправить аудио', 'send_audio')],
                [Markup.button.callback('Отправить голосовое сообщение', 'send_voice')],
            ]),
        );
    }

    @Action('contacts')
    async onContacts(@Ctx() ctx: Context) {
        await ctx.reply(
            '*Контакты:*\n' +
            '• *Офис*: _Московская область, г\\. Ступино, ул\\. Пристанционная 6 стр\\. 3, эт\\. 2\\._\n' +
            '• *Офис*: _Москва, ул\\. Ленинская Слобода, 26с5, эт\\. 1, оф\\. 1312, БЦ "Симонов Плаза"\\._\n' +
            '• *Склад*: _Московская область, г\\. Ступино, ул\\. Транспортная 3\\._',
            { parse_mode: 'MarkdownV2' }
        );
    }

    @Action('prices')
    async onPrices(@Ctx() ctx: Context) {
        await ctx.reply('Вы выбрали опцию 2');
    }

    @Command('help')
    async onHelp(@Ctx() ctx: Context) {
        await ctx.reply('Вот список доступных команд: /start, /help, /info, /send_photo, /send_audio, /send_voice');
    }

    @Command('info')
    async onInfo(@Ctx() ctx: Context) {
        await ctx.reply('Это информация о боте.');
    }

    @Action('send_photo')
    async onSendPhoto(@Ctx() ctx: Context) {
        const photoUrl = 'https://s3.timeweb.cloud/0fd3fca7-top-hotels/i.jpeg';
        await ctx.telegram.sendPhoto(ctx.chat.id, photoUrl, {
            caption: 'My Father!',
        });
    }

    @Action('send_audio')
    async onSendAudio(@Ctx() ctx: Context) {
        const audioUrl = 'https://example.com/path/to/audio.mp3';
        await ctx.telegram.sendAudio(ctx.chat.id, audioUrl, {
            caption: 'Вот ваш аудиофайл!',
        });
    }

    @Action('send_voice')
    async onSendVoice(@Ctx() ctx: Context) {
        const voiceUrl = 'https://example.com/path/to/voice.ogg';
        await ctx.telegram.sendVoice(ctx.chat.id, voiceUrl, {
            caption: 'Вот ваше голосовое сообщение!',
        });
    }
}
