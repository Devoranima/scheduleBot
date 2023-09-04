import {Telegraf, Markup, Context} from 'telegraf';
import dotenv from 'dotenv';
import { Update } from 'telegraf/typings/core/types/typegram';
import { checkIfDateGood, formatReply, getScheduleForDay, getWeek } from './utils/functions';
dotenv.config();

const bot_token = process.env.BOT_TOKEN as string;

export class Bot extends Telegraf<Context<Update>>{
  constructor(){
    super(bot_token);
    this.handlerWalter();
  }

  startBot(){
    this.launch();
    const date = new Date();
    console.log('Bot started at ' + date.getHours() + ":" + date.getMinutes());
  
    // Enable graceful stop
    process.once('SIGINT', () => this.stop('SIGINT'));
    process.once('SIGTERM', () => this.stop('SIGTERM'));
  }

  handlerWalter(){
    this.handleStart();
    this.handleToday();
    this.handleTomorrow();
    this.handleWeek();
    this.handleDelete();

    this.telegram.setMyCommands([
      {
        command: 'start',
        description: 'restart bot',
      }
  ]);
  }

  handleStart(){
    this.start((ctx)=>{
      ctx.reply('Welcome, stranger!',
        Markup.keyboard([
            ['Today 📜', 'Tomorrow 📋', 'Week 📚'],
        ])
        .oneTime()
        .resize()
      )
    })
  }

  handleToday(){
    this.hears('Today 📜', (ctx)=>{
      const date = new Date();
      const week = getWeek(date);
      const day = date.getDay();
      const reply = formatReply(day, week);
      return ctx.reply(reply);
    })
  }

  handleTomorrow(){
    this.hears('Tomorrow 📋', (ctx)=>{
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1)
      const day = tomorrow.getDay();
      const week = getWeek(tomorrow);
      const reply = formatReply(day, week);
      return ctx.reply(reply);
    })
  }

  handleWeek(){
    this.hears('Week 📚', (ctx)=>{
      ctx.reply('not ready yet')
    })
  }

  handleDelete(){
    this.action('delete_feedback', ctx => {
      ctx.deleteMessage()
    })
  }
}
