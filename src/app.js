const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const CONST = require('./const');
let DATA = require('./data.json');

const bot = new TelegramBot(CONST.token, {
  polling: true,
});

let question = '';
let isAction = false;
let isReceivingQuestion = false;
let isConfirmingQuestion = false;
const isStart = (msg) => msg === CONST.start;
const isYes = (msg) => msg === CONST.yes;

bot.onText(/\/start/, (msg) => {
  console.log('/start');
  bot.sendMessage(msg.chat.id, CONST.welcoming, {
    parse_mode: 'HTML',
    reply_markup: {
      keyboard: [[CONST.action]],
      resize_keyboard: true,
    },
  });
});

bot.on('message', (msg) => {
  console.log('message');
  if (!isStart(msg.text)) {
    if (!isAction) {
      isAction = msg.text === CONST.action;
      if (!isAction) {
        console.log('choose action');
        bot.deleteMessage(msg.chat.id, msg.message_id);
        bot.sendMessage(msg.chat.id, CONST.textChooseAction);
      } else {
        bot.sendMessage(msg.chat.id, CONST.textWriteQuestion, {
          reply_markup: {
            remove_keyboard: true,
          },
        });
        isReceivingQuestion = true;
      }
    } else {
      if (isReceivingQuestion) {
        console.log('receiving question');
        question = msg.text;
        bot.sendMessage(msg.chat.id, `${CONST.textConfirmQuestion}\n\n${question}`, {
          reply_markup: {
            keyboard: [CONST.yesNo],
            resize_keyboard: true,
          },
        });
        isConfirmingQuestion = true;
        isReceivingQuestion = false;
      } else {
        if (isConfirmingQuestion) {
          const isConfirm = CONST.yesNo.includes(msg.text);
          console.log('confirming', isConfirm);
          if (!isConfirm) {
            console.log('choose confirm');
            bot.deleteMessage(msg.chat.id, msg.message_id);
            bot.sendMessage(msg.chat.id, CONST.textChooseResponse);
          } else {
            console.log('is confirm');
            isConfirmingQuestion = false;
            if (isYes(msg.text)) {
              console.log('yes', question);
              isAction = false;
              isReceivingQuestion = false;
              bot.sendMessage(msg.chat.id, CONST.textEnd(question), {
                reply_markup: {
                  remove_keyboard: true,
                  keyboard: [[CONST.action]],
                  resize_keyboard: true,
                },
              });
              DATA.push({ id: msg.chat.id, question });
              fs.writeFileSync('./src/data.json', JSON.stringify(DATA, null, '    '));
            } else {
              console.log('no');
              isReceivingQuestion = true;
              bot.sendMessage(msg.chat.id, CONST.textWriteQuestion, {
                reply_markup: {
                  remove_keyboard: true,
                },
              });
            }
          }
        }
      }
    }
  }
});
