import { firstSempt, schedule, timetable } from "./constants";
import { day, lesson } from './types';


export const getWeek = (date: Date) => {
  const diff = Math.floor((date.getTime() - firstSempt)/1000/60/60/24) - 3;
  return Math.floor(diff/7)%2 === 0 ? 'even' : 'odd';
}

export const checkIfLessonGood = (lesson: lesson, week: 'odd' | 'even') => {
  return lesson && (lesson.periodic === undefined || lesson.periodic === week)
}

export const getScheduleForDay = (day: number, week: 'odd' | 'even') => {
  return schedule[day-1].map(lesson => {
    if (lesson && lesson.periodic &&  lesson.periodic !== week) return null;
    return lesson;
  })
}

export const formatReply = (day: number, week: 'odd' | 'even') => {
  if (checkIfDateGood(day) === false){
    return 'No lessons for that day';
  }
  const schedule = getScheduleForDay(day, week);
  const reply = [] as string [];
  for (let i = 0; i < 7; i++){
    if (schedule[i]){
      reply.push(`${timetable[i]}: ${schedule[i].name} ${schedule[i].room || 'ЭОР'}`);
    }
  }
  return reply.join('\n');
}

export const checkIfDateGood = (day: number) => {
  return (day !== 6 && day !== 0)
}