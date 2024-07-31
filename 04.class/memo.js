#!/usr/bin/env node
import fs from "fs";
import { Command } from "commander";
import readline from "readline";
import { select } from "@inquirer/prompts";

function getArgsAndOptions() {
  const program = new Command();
  program.option("-l");
  program.option("-r");
  program.option("-d");
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

function saveFile(filename, memos) {
  try {
    fs.writeFileSync(filename, JSON.stringify(memos, null, 4), "utf-8");
  } catch (err) {
    console.log(err);
  }
}

function add(memos) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const newMemo = { body: "" };

  rl.on("line", (line) => {
    newMemo.body += `${line}\n`;
  });

  rl.on("close", () => {
    memos.push(newMemo);
    saveFile("db.json", memos);
    console.log("Memo added.");
  });
}

function getTitles(memos) {
  return memos.map((memo) => memo.body.split("\n")[0]);
}

function listTitles(memos) {
  const titles = getTitles(memos);
  titles.forEach((title) => console.log(title));
}

async function getSelectedIndex(memos) {
  const titles = getTitles(memos);
  const memoChoices = titles.map((title, index) => {
    return {
      name: title,
      value: index,
    };
  });
  return select({
    type: "list",
    message: "Select a Memo.",
    choices: memoChoices,
  });
}

function showDetail(memos) {
  getSelectedIndex(memos)
    .then((selectedIndex) => {
      console.log(memos[selectedIndex].body);
    })
    .catch((err) => {
      console.log(err);
    });
}

function remove(memos) {
  getSelectedIndex(memos)
    .then((selectedIndex) => {
      const updatedMemos = memos.filter((_, index) => index !== selectedIndex);
      saveFile("db.json", updatedMemos);
      console.log("Memo removed.");
    })
    .catch((err) => {
      console.log(err);
    });
}

function main() {
  const { args, options } = getArgsAndOptions();
  const memos = getMemos();
  if (options.l) {
    listTitles(memos);
  } else if (options.r) {
    showDetail(memos);
  } else if (options.d) {
    remove(memos);
  } else if (args.length === 0) {
    add(memos);
  }
}

main();
