#!/usr/bin/env node
import fs from "fs";
import { Command } from "commander";
import readline from "readline";
import { select } from "@inquirer/prompts";

function getArgsAndOptions() {
  const program = new Command();
  program.option("-l");
  program.option("-r");
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

async function showMemo(memos) {
  const memoTitles = memos.map((memo) => memo.body.split("\n")[0]);
  const memoChoices = memoTitles.map((memoTitle, index) => {
    return {
      name: memoTitle,
      value: index,
    };
  });
  const selectedMemoIndex = await select({
    type: "list",
    message: "Select a Memo.",
    choices: memoChoices,
  });
  console.log(memos[selectedMemoIndex].body);
}

function main() {
  const { args, options } = getArgsAndOptions();
  const memos = getMemos();
  if (options.l) {
    displayMemoTitles(memos);
  } else if (options.r) {
    showMemo(memos);
  } else if (args.length === 0) {
    addMemo(memos);
  }
}

main();
