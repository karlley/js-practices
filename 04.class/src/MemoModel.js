export class MemoModel {
  constructor(content) {
    this.body = content.body;
  }

  getTitle() {
    return this.body.split("\n")[0];
  }
}
