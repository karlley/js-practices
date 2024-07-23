#!/usr/bin/env node
import minimist from "minimist";
import { DateTime } from "luxon";

const SATURDAY = 6;
const SUNDAY = 7;

function getYearAndMonth() {
  const currentDate = DateTime.now();
  const args = minimist(process.argv.slice(2), {
    default: {
      y: currentDate.year,
      m: currentDate.month,
    },
  });
  const { y: year, m: month } = args;
  return { year, month };
}

function getLastDayOfMonth(year, month) {
  return DateTime.local(year, month).endOf("month").day;
}

function generateDates({ year, month }) {
  const lastDayOfMonth = getLastDayOfMonth(year, month);
  return Array.from({ length: lastDayOfMonth }, (_, index) =>
    DateTime.local(year, month, index + 1),
  );
}

function isSaturday(date) {
  return date.weekday === SATURDAY;
}

function isSunday(date) {
  return date.weekday === SUNDAY;
}

function isLastDay(date) {
  return date.day === getLastDayOfMonth(date.year, date.month);
}

function firstDayOffset(date) {
  return !isSunday(date) ? " ".repeat(date.weekday * 3) : "";
}

function newLineOrSpace(date) {
  const separator = isSaturday(date) ? "\n" : " ";
  return isLastDay(date) ? "\n\n" : separator;
}

function printCalendar(dates, { year, month }) {
  console.log(`      ${month}月 ${year}`);
  console.log("日 月 火 水 木 金 土");

  process.stdout.write(firstDayOffset(dates[0]));
  dates.forEach((date) => {
    process.stdout.write(
      date.day.toString().padStart(2, " ") + newLineOrSpace(date),
    );
  });
}

function main() {
  const yearAndMonth = getYearAndMonth();
  const dates = generateDates(yearAndMonth);
  printCalendar(dates, yearAndMonth);
}

main();
