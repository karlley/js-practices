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

function generateDates({ year, month }) {
  const lastDayOfMonth = DateTime.local(year, month).endOf("month").day;
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

function isLastDay(date, dates) {
  return date.day === dates.length;
}

function shift(date) {
  return date.day === 1 && !isSunday(date) ? " ".repeat(date.weekday * 3) : "";
}

function newLineOrSpace(date, dates) {
  const separator = isSaturday(date) ? "\n" : " ";
  return isLastDay(date, dates) ? "\n\n" : separator;
}

function printCalendar(dates, { year, month }) {
  console.log(`      ${month}月 ${year}年`);
  console.log("日 月 火 水 木 金 土");

  dates.forEach((date) => {
    process.stdout.write(
      shift(date) +
        date.day.toString().padStart(2, " ") +
        newLineOrSpace(date, dates),
    );
  });
}

function main() {
  const yearAndMonth = getYearAndMonth();
  const dates = generateDates(yearAndMonth);
  printCalendar(dates, yearAndMonth);
}

main();
