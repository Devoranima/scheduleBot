import {Telegraf, Markup, Context} from 'telegraf';
import dotenv from 'dotenv';
import { Update } from 'telegraf/typings/core/types/typegram';
import { formatReply, getWeek } from './utils/functions';
import { days } from './utils/constants';
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
      return ctx.replyWithMarkdown(reply);
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
      return ctx.replyWithMarkdown(reply);
    })
  }

  handleWeek(){
    this.hears('Week 📚', (ctx)=>{
      const week = getWeek(new Date());
      let reply = [] as string [];
      for(let i = 0; i < 5; i++){
        reply.push( `_${days[i]}_\n\n${formatReply(i+1, week)}`);
      }

      ctx.replyWithMarkdown(reply.join('\n\n\n'))
    })
  }

  handleDelete(){
    this.action('delete_feedback', ctx => {
      ctx.deleteMessage()
    })
  }
}
