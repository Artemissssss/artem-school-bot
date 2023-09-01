import TelegramBot from 'node-telegram-bot-api';
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});


export default async function handler(req, res) {
        const chatId = req.body.chat.id;
        const opts = {
            reply_markup: {
                keyboard: [
                    ['Level 1', 'Level 2'],
                    ['Level 3', 'Level 4']
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        };
        bot.sendMessage(chatId, 'Choose a level:', opts);
        res.status(200)
}
