#!/usr/bin/env node
import fs from "fs";

const input = process.argv[2];

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

function main() {
  if (input) {
    addMemo(input);
  }
  const memos = getMemos();
  const memoTitles = memos.map((memo) => memo.body.split("\n")[0]);
  memoTitles.forEach((title) => console.log(title));
}

main();
