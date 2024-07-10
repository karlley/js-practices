#!/usr/bin/env node
import minimist from "minimist";
import { DateTime } from "luxon";

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

function generateDatesForMonth({ year, month }) {
  const lastDayOfMonth = DateTime.local(year, month).endOf("month").day;
  return Array.from({ length: lastDayOfMonth }, (_, index) =>
    DateTime.local(year, month, index + 1),
  );
}

function isSaturday(date) {
  return date.weekday === 6;
}

function printCalendar(dates, { year, month }) {
  console.log(`      ${month}月 ${year}年`);
  console.log("日 月 火 水 木 金 土");

  process.stdout.write(" ".repeat(dates[0].weekday * 3));
  dates.forEach((date) => {
    process.stdout.write(date.day.toString().padStart(2, " "));
    process.stdout.write(isSaturday(date) ? "\n" : " ");
  });
  process.stdout.write("\n");
  if (!isSaturday(dates[dates.length - 1])) {
    process.stdout.write("\n");
  }
}

function main() {
  const yearAndMonth = getYearAndMonth();
  const dates = generateDatesForMonth(yearAndMonth);
  printCalendar(dates, yearAndMonth);
}

main();
