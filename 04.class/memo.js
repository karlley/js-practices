#!/usr/bin/env node

import { CommandLineInterface } from "./src/CommandLineInterface.js";
import { Storage } from "./src/Storage.js";
import { MemoApp } from "./src/MemoApp.js";

const FILENAME = "db.json";
const ENCODING = "utf8";

async function main() {
  try {
    const { args, options } = CommandLineInterface.getArgsAndOptions();
    const storage = new Storage(FILENAME, ENCODING);
    const memos = storage.load();
    const memoApp = new MemoApp(memos, storage);

    if (options.l) {
      memoApp.listTitles();
    } else if (options.r) {
      await memoApp.showDetail();
    } else if (options.d) {
      await memoApp.remove();
    } else if (args.length === 0) {
      memoApp.add();
    }
  } catch (error) {
    console.error(error);
  }
}

main();
