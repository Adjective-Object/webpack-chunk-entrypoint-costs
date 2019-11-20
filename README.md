# webpack-import-usage-stats

[npm](https://www.npmjs.com/package/webpack-import-usage-stats), [github](https://github.com/Adjective-Object/webpack-import-usage-stats)

Gets information about how much of a webpack chunk is actually evaluated at runtime from import usage data.

## Overview

This tool assumes your chunk has a single entry point that branches out to several imports.  
e.g. lazyIndex here is a single module which reexports `mod1`, `mod2`, and `mod3`.

```
                  +
                  |
                  |  async
                  |  import
                  |
                  v
           +------+-------+
     +-----+  lazy index  +-----+
     |     +------+-------+     | sync imports
     |            |             |
     v            v             v
+----+-----+ +----+-----+ +-----+----+
|          | |          | |          |
|   mod1   | |   mod2   | |   mod3   |
|          | |          | |          |
+----------+ +----------+ +----------+
```

If `lazyIndex.mod3` is never evaluated, then it will be included in the chunk but never exported. Alternatively, if it is first evaluated many minutes after `lazyIndex` is evaluated, then there is a good chance that it should be its own lazy entrypoint.

## Development

```sh
yarn # install dependencies
yarn build # build.             Can also use `rollup -c`
yarn watch # build with watch.  Can also use `rollup -cw`
node ./scripts/bootstrap-dev-data.js # bootstrap derived data for tests
yarn jest # run tests
```
