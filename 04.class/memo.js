#!/usr/bin/env node
import fs from "fs";
import { Command } from "commander";
import readline from "readline";
import { select } from "@inquirer/prompts";

class CommandLineInterface {
  static program = new Command();

  static getArgsAndOptions() {
    this.program.option("-l");
    this.program.option("-r");
    this.program.option("-d");
    this.program.parse(process.argv);
    this.program.arguments("[input]");

    const options = this.program.opts();
    const args = this.program.args;
    return { args, options };
  }
}

class Memo {
  constructor(body) {
    this.body = body;
  }
}

class StorageService {
  constructor(filename) {
    this.filename = filename;
  }

  load() {
    try {
      return JSON.parse(fs.readFileSync(this.filename, "utf8")).map(
        (memoData) => new Memo(memoData.body),
      );
    } catch (err) {
      console.log(err);
    }
  }

  save(memos) {
    try {
      fs.writeFileSync(this.filename, JSON.stringify(memos, null, 4), "utf-8");
    } catch (err) {
      console.log(err);
    }
  }
}

class MemoService {
  constructor(memos, storageService) {
    this.memos = memos;
    this.storageService = storageService;
  }

  getTitles() {
    return this.memos.map((memo) => memo.body.split("\n")[0]);
  }

  listTitles() {
    const titles = this.getTitles();
    titles.forEach((title) => console.log(title));
  }

  async promptForGetIndex() {
    const titles = this.getTitles();
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

  showDetail() {
    this.promptForGetIndex()
      .then((selectedIndex) => {
        console.log(memos[selectedIndex].body);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  add() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const memo = new Memo("");

    rl.on("line", (line) => {
      memo.body += `${line}\n`;
    });

    rl.on("close", () => {
      this.memos.push(memo);
      this.storageService.save(this.memos);
      console.log("Memo added.");
    });
  }

  remove() {
    this.promptForGetIndex(this.memos)
      .then((selectedIndex) => {
        const updatedMemos = this.memos.filter(
          (_, index) => index !== selectedIndex,
        );
        this.storageService.save(updatedMemos);
        console.log("Memo removed.");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function main() {}

const { args, options } = CommandLineInterface.getArgsAndOptions();
const storageService = new StorageService("db.json");
const memos = storageService.load();
const memoService = new MemoService(memos, storageService);

if (options.l) {
  memoService.listTitles();
} else if (options.r) {
  memoService.showDetail();
} else if (options.d) {
  memoService.remove();
} else if (args.length === 0) {
  memoService.add();
}

main();
