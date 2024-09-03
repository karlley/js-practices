import { CommandLineInterface } from "./src/CommandLineInterface.js";
import { Storage } from "./src/Storage.js";
import { MemoController } from "./src/MemoController.js";

const FILENAME = "db.json";
const ENCODING = "utf8";

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
