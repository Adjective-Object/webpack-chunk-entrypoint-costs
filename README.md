# webpack-chunk-entrypoint-costs

[npm](https://www.npmjs.com/package/webpack-chunk-entrypoint-costs), [github](https://github.com/Adjective-Object/webpack-chunk-entrypoint-costs)

Gets cost information about modules within webpack chunks

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

This tool associates module size information from sourcemaps with dependency information
derived from your webpack `stats.json` in order to get the actual costs of modules and
their transitive dependencies.

## Usage

```ts
const fs = require('fs');
const deriveBundleData = require('webpack-bundle-diff').deriveBundleData;
const getModuleGraphWithReasons = require('webpack-bundle-diff-add-reasons')
    .getModuleGraphWithReasons;
const getChunkCostsForEntrypoints = require('webpack-chunk-entrypoint-costs')
    .getChunkCostsForEntrypoints;
const explore = require('source-map-explorer').explore;

// Get bundle stats with reasons
const statsJson = JSON.parse(fs.readFileSync('stats.json'));
const bundleData = deriveBundleData(statsJson);
const bundleGraphWithReasons = getModuleGraphWithReasons(
    bundleData.graph,
    statsJson,
);

// explore the source map
const exploredSourcemap = await explore(['./dist/MyApplication.js.map']);

const chunkCosts = getChunkCostsForEntrypoints(
    bundleGraphWithReasons,
    exploredSourcemap,
    [
        './pagages/mod1/src/index.js',
        './pagages/mod2/src/index.js',
        './pagages/mod3/src/index.js',
    ],
);
```

## Output structure

```ts
interface ChunkCost {
    entrypoints: [
        // Array of some number of entrypoint chunks
        {
            /**
             * Name of the entry point module
             */
            name: string;
            /**
             * Total downstream cost of this entry point
             */
            downstreamCost: number;
            /**
             * Names of all the modules present in the source map that are in the
             * dependencies (indirect or otherwise) of this entry point
             */
            dependencyNames: string[];
            /**
             * Names of modules that were present in the dependencies of
             * this module, but were not present in the source map.
             *
             * This likely means that the module was pruned from this chunk,
             * and so is not present in the source map, but is still present
             * in the `reasons` map.
             */
            missingModuleNames: string[];
            /**
             * Cost of the modules that are unique to this entry point among
             * the other entry points in the same `ChunkCosts` structure
             */
            uniqueDownstreamCost: number;
            /**
             * Names of this entry point module's dependencies, indirect
             * or otherwise, that are unique to this entry point among
             * the other entry points in the same `ChunkCosts` structure
             */
            uniqueDependencyNames: string[];
        },
    ];
    /**
     * Map of module names (as addressed in bundleStats.json)
     * to partial module cost objects
     **/
    modules: {
        [key: string]: {
            individualCost: number;
        };
    };
}
```

## Development

```sh
yarn # install dependencies
yarn build # build.             Can also use `rollup -c`
yarn watch # build with watch.  Can also use `rollup -cw`
node ./scripts/bootstrap-dev-data.js # bootstrap derived data for tests
yarn jest # run tests
```
