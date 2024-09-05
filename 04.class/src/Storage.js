import fs from "fs";
import { Memo } from "./Memo.js";

const JSON_SPACING = 4;

export class Storage {
  constructor(filename, encoding) {
    this.filename = filename;
    this.encoding = encoding;
  }

  load() {
    try {
      return JSON.parse(fs.readFileSync(this.filename, this.encoding)).map(
        (content) => new Memo(content),
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
