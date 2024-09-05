#!/usr/bin/env node

import { CommandLineInterface } from "./src/CommandLineInterface.js";
import { Storage } from "./src/Storage.js";
import { MemoManager } from "./src/MemoManager.js";

const FILENAME = "db.json";
const ENCODING = "utf8";

async function main() {
  try {
    const { args, options } = CommandLineInterface.getArgsAndOptions();
    const storage = new Storage(FILENAME, ENCODING);
    const memos = storage.load();
    const memoManager = new MemoManager(memos, storage);

    if (options.l) {
      memoManager.listTitles();
    } else if (options.r) {
      await memoManager.showDetail();
    } else if (options.d) {
      await memoManager.remove();
    } else if (args.length === 0) {
      memoManager.add();
    }
  } catch (error) {
    console.error(error);
  }
}

main();
