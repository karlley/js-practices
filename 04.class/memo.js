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
    this.encoding = "utf8";
  }

  load() {
    try {
      return JSON.parse(fs.readFileSync(this.filename, this.encoding)).map(
        (memoData) => new Memo(memoData.body),
      );
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  save(memos) {
    try {
      fs.writeFileSync(
        this.filename,
        JSON.stringify(memos, null, 4),
        this.encoding,
      );
    } catch (error) {
      console.error(error);
    }
  }
}

class MemoService {
  constructor(memos, storageService) {
    this.memos = memos;
    this.storageService = storageService;
  }

  isMemosEmpty() {
    if (this.memos.length === 0) {
      console.log("No memos found.");
      return true;
    }
    return false;
  }

  getTitles() {
    return this.memos.map((memo) => memo.body.split("\n")[0]);
  }

  listTitles() {
    if (this.isMemosEmpty()) return;

    const titles = this.getTitles();
    titles.forEach((title) => console.log(title));
  }

  async promptForGetIndex() {
    try {
      const titles = this.getTitles();
      const memoChoices = titles.map((title, index) => {
        return {
          name: title,
          value: index,
        };
      });

      return await select({
        type: "list",
        message: "Select a Memo.",
        choices: memoChoices,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async showDetail() {
    if (this.isMemosEmpty()) return;

    try {
      const selectedIndex = await this.promptForGetIndex();
      console.log(this.memos[selectedIndex].body);
    } catch (error) {
      console.error(error);
    }
  }

  async remove() {
    if (this.isMemosEmpty()) return;

    try {
      const selectedIndex = await this.promptForGetIndex();
      const updateMemos = this.memos.filter((_, index) => {
        return index !== selectedIndex;
      });
      this.storageService.save(updateMemos);
      console.log("Memo removed.");
    } catch (error) {
      console.error(error);
    }
  }

  add() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const lines = [];

    rl.on("line", (line) => {
      lines.push(line);
    });
    rl.on("close", () => {
      const body = lines.join("\n").trim();

      if (body === "") {
        console.log("Cannot create an empty memo.");
        return;
      }

      try {
        const memo = new Memo(body);
        this.memos.push(memo);
        this.storageService.save(this.memos);
        console.log("Memo added.");
      } catch (error) {
        console.error(error);
      }
    });
  }
}

async function main() {
  const { args, options } = CommandLineInterface.getArgsAndOptions();
  const storageService = new StorageService("db.json");
  const memos = storageService.load();
  const memoService = new MemoService(memos, storageService);

  try {
    if (options.l) {
      memoService.listTitles();
    } else if (options.r) {
      await memoService.showDetail();
    } else if (options.d) {
      await memoService.remove();
    } else if (args.length === 0) {
      memoService.add();
    }
  } catch (error) {
    console.error(error);
  }
}

main();
