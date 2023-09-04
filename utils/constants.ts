import * as fs from 'fs';
import { day, lesson } from './types';

export const firstSempt = 1693515600000;
export const lessons = fs.readFileSync('./src/schedule.txt', {encoding: 'utf8', flag: 'r'}).split(/\r?\n/);
export const timetable = fs.readFileSync('./src/timetable.txt', {encoding: 'utf8',flag:'r'}).split(/\r?\n/);

const schedule = [] as day [];

for (let i = 0; i < 5; i++){
  const day = [] as day;
  for (let j = 0; j < 7; j++){
    const lesson_str = lessons[i*7+j];
    if (lesson_str === ''){
      day.push(null);
      continue;
    }
    const lesson = {} as lesson;
    const splitted = lesson_str.trim().split('.').map(e => e.trim());

    let k = 0;
    switch (splitted[k]){
      case 'н/н':{
        lesson.periodic = 'odd';
        k++;
        break;
      }
      case 'ч/н':{
        lesson.periodic = 'even';
        k++;
        break;
      }
      default:{
        break;
      }
    }
    lesson.name = splitted[k++];
    k++; // Skip 'ауд'
    lesson.room = parseInt(splitted[k]);

    day.push(lesson);
  }
  
  schedule.push(day)
}

export {schedule}