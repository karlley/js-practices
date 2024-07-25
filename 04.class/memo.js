#!/usr/bin/env node
import fs from "fs";
import { Command } from "commander";

function getArgsAndOptions() {
  const program = new Command();
  program.option("-l");
  program.parse(process.argv);
  program.arguments("[input]");
  const options = program.opts();
  const args = program.args;
  return { args, options };
}

function getMemos() {
  try {
    return JSON.parse(fs.readFileSync("db.json", "utf8"));
  } catch (err) {
    console.log(err);
  }
}

function addMemo(input) {
  const memos = getMemos();
  const newMemo = { body: input };
  memos.push(newMemo);

  try {
    fs.writeFileSync("db.json", JSON.stringify(memos, null, 4), "utf-8");
  } catch (err) {
    console.log(err);
  }
}

function displayMemoTitles(memos) {
  const memoTitles = memos.map((memo) => memo.body.split("\n")[0]);
  memoTitles.forEach((title) => console.log(title));
}

function main() {
  const { args, options } = getArgsAndOptions();
  const memos = getMemos();
  if (options.l) {
    displayMemoTitles(memos);
  }
  if (args[0]) {
    addMemo(args[0]);
  }
}

main();
