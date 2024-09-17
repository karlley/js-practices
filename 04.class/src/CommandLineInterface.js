import { Command } from "commander";

export class CommandLineInterface {
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
