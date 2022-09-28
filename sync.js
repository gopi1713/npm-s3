const shell = require("shelljs");
const chokidar = require("chokidar");

let source = process.argv[2];
let bucket = process.argv[3];

console.log(`Watching ${source}`);

function sync() {
  try {
    let res = shell.exec(`aws --endpoint-url http://10.42.4.108:9000 s3 sync ${source} s3://${bucket} --delete`);

    if (res.stdout) {
      console.log(res.stdout);
    }
  } catch (err) {
    console.error(err);
  }
}

let watcher = chokidar.watch(source, { ignored: /(^|[\/\\])\.DS_Store/, ignoreInitial: true });

watcher.on("ready", () => {
  sync();
});

watcher.on("all", (eventType, filename) => {
  sync(eventType, filename);
});

watcher.on("error", err => {
  console.error(err);
  process.exit(1);
});
