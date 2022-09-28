#!/usr/bin/env node

const pm2 = require("pm2");
const shell = require("shelljs");
const yargs = require("yargs");
const Promise = require("bluebird");
const npm = require("npm");

Promise.promisifyAll(npm);
Promise.promisifyAll(pm2);

const argv = yargs
  .options({
    source: {
      alias: "s",
      describe: "local source directory, file, or blob"
    },
    bucket: {
      alias: "b",
      describe: "S3 bucket (with optional path) that is destination of sync"
    },
    list: {
      describe: "list active syncs"
    },
    logs: {
      alias: "l",
      describe: "show last 15 lines of logs"
    },
    stop: {
      describe: "stop watching all sources"
    }
  })
  .usage("Watch a local file, directory, or glob for changes and sync them to an s3 bucket (or bucket and path). Must have aws CLI installed.")
  .usage("")
  .usage("Usage: $0 -s [string] -b [string]")
  .help("h")
  .alias("h", "help")
  .example("$0 -s '/path/to/file/or/directory' -b 's3-bucket/and/path'")
  .example("$0 --source '/a/glob/*/**' --bucket 's3-bucket'").argv;

async function start(argv) {
  try {
    let myConfigObject = {};

    await npm.loadAsync(myConfigObject);

    let prefix = npm.globalDir + "/@jaaromy/s3-sync";

    let pm2Path = `${prefix}/node_modules/.bin/pm2`; //await getInstalledPath("pm2", { local: true });

    if (argv.list) {
      shell.exec(`${pm2Path} list`);
      return;
    }

    if (argv.logs) {
      shell.exec(`${pm2Path} logs --nostream`);
      return;
    }

    if (argv.stop) {
      shell.exec(`${pm2Path} delete s3-sync`);
      return;
    }

    if (!argv.bucket && !argv.source) {
      console.log("");
      console.error("Missing required arguments: source, bucket");
      console.log("s3-sync --help");
      return;
    }

    await pm2.startAsync({
      name: "s3-sync",
      script: `${prefix}/sync.js`,
      args: [argv.source, argv.bucket]
    });

    pm2.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

start(argv);
