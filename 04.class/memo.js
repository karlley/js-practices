#!/usr/bin/env node
import fs from "fs";
import { Command } from "commander";
import readline from "readline";
import { select } from "@inquirer/prompts";

const FILENAME = "db.json";
const ENCODING = "utf8";
const JSON_SPACING = 4;

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

class Storage {
  constructor(filename, encoding) {
    this.filename = filename;
    this.encoding = encoding;
  }

  load() {
    try {
      return JSON.parse(fs.readFileSync(this.filename, this.encoding)).map(
        (memoData) => new Memo(memoData.body),
      );
    } catch (error) {
      throw new Error(`Failed to load memos: ${error.message}`);
    }
  }

  save(memos) {
    try {
      fs.writeFileSync(
        this.filename,
        JSON.stringify(memos, null, JSON_SPACING),
        this.encoding,
      );
    } catch (error) {
      throw new Error(`Failed to save memos: ${error.message}`);
    }
  }
}

class MemoController {
  constructor(memos, storage) {
    this.memos = memos;
    this.storage = storage;
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
      throw new Error(`Failed to select memo: ${error.message}`);
    }
  }

  async showDetail() {
    if (this.isMemosEmpty()) return;

    try {
      const selectedIndex = await this.promptForGetIndex();
      console.log(this.memos[selectedIndex].body);
    } catch (error) {
      throw new Error(`Failed to show memo detail: ${error.message}`);
    }
  }

  async remove() {
    if (this.isMemosEmpty()) return;

    try {
      const selectedIndex = await this.promptForGetIndex();
      const updateMemos = this.memos.filter((_, index) => {
        return index !== selectedIndex;
      });
      this.storage.save(updateMemos);
      console.log("Memo removed.");
    } catch (error) {
      throw new Error(`Failed to remove memo: ${error.message}`);
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
        this.storage.save(this.memos);
        console.log("Memo added.");
      } catch (error) {
        throw new Error(`Failed to add memo: ${error.message}`);
      }
    });
  }
}

async function main() {
  try {
    const { args, options } = CommandLineInterface.getArgsAndOptions();
    const storage = new Storage(FILENAME, ENCODING);
    const memos = storage.load();
    const memoController = new MemoController(memos, storage);

    if (options.l) {
      memoController.listTitles();
    } else if (options.r) {
      await memoController.showDetail();
    } else if (options.d) {
      await memoController.remove();
    } else if (args.length === 0) {
      memoController.add();
    }
  } catch (error) {
    console.error(error);
  }
}

main();
