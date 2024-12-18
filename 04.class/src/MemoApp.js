import readline from "readline";
import { select } from "@inquirer/prompts";
import { Memo } from "./Memo.js";

export class MemoApp {
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

  listTitles() {
    if (this.isMemosEmpty()) return;

    const titles = this.memos.map((memo) => memo.getTitle());
    titles.forEach((title) => console.log(title));
  }

  async promptForGetIndex() {
    try {
      const titles = this.memos.map((memo) => memo.getTitle());
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
        console.log("\nCannot create an empty memo.");
        return;
      }

      try {
        const memo = new Memo({ body });
        this.memos.push(memo);
        this.storage.save(this.memos);
        console.log("\nMemo added.");
      } catch (error) {
        throw new Error(`Failed to add memo: ${error.message}`);
      }
    });
  }
}
