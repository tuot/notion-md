#!/usr/bin/env node

const { Command } = require("commander");

const download = require("./index");
const program = new Command();

// add some useful info on help
program.on("--help", () => {
  console.log();
  console.log("Run notion-md <command> --help for detailed usage of given command.");
  console.log();
});

program
  .command("download <url/databaseId/pageId>")
  .description("Convert and download notion pages.")
  .option("-p, --path <path>", "The path to save file.")
  .action((keyword, options) => download(keyword, options));

program.parse();
