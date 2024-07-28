#!/usr/bin/env node
import fs from "fs";
import { Command } from "commander";
import readline from "readline";

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

function addMemo(memos) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const memo = { body: "" };

  rl.on("line", (line) => {
    memo.body += `${line}\n`;
  });

  rl.on("close", () => {
    memos.push(memo);
    try {
      fs.writeFileSync("db.json", JSON.stringify(memos, null, 4), "utf-8");
    } catch (err) {
      console.log(err);
    }
  });
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
  } else if (args.length === 0) {
    addMemo(memos);
  }
}

main();
