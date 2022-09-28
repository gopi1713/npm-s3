# s3-sync

## Install from NPM

```bash
npm install @jaaromy/s3-sync -g
s3-sync -s '.' -b 'my-bucket'
```

## Console Help Contents

```bash
s3-sync --help
```

```text
Watch a local file, directory, or glob for changes and sync them to an s3 bucket
(or bucket and path). Must have aws CLI installed.

Usage: s3-sync -s [string] -b [string]

Options:
  --version     Show version number                                    [boolean]
  --source, -s  local source directory, file, or blob
  --bucket, -b  S3 bucket (with optional path) that is destination of sync
  --list        list active syncs
  --logs, -l    show last 15 lines of logs
  --stop        stop watching all sources
  -h, --help    Show help                                              [boolean]

Examples:
  s3-sync -s '/path/to/file/or/directory' -b 's3-bucket/and/path'
  s3-sync --source '/a/glob/*/**' --bucket 's3-bucket'
```
