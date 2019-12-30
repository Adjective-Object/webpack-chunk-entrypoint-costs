import { ModuleGraphWithReasons } from 'webpack-bundle-diff-add-reasons';
import { explore, ExploreResult } from 'source-map-explorer';
import { join as joinPath } from 'path';
import { readFile } from 'mz/fs';
import { getChunkCostsForEntrypoints } from '../getChunkCostsForEntrypoints';

describe('getChunkCostsForEntrypoints', () => {
    let exploreResult: ExploreResult;
    let bundleGraph: ModuleGraphWithReasons;

    beforeEach(async () => {
        if (exploreResult == null || bundleGraph == null) {
            [exploreResult, bundleGraph] = await Promise.all([
                explore([
                    joinPath(__dirname, './test-data/sample.js'),
                    joinPath(__dirname, './test-data/sample.map'),
                ]),
                readFile(
                    joinPath(
                        __dirname,
                        'test-data',
                        'derived',
                        'bundleStats.json',
                    ),
                    'utf-8',
                ).then(r => JSON.parse(r).graph),
            ]);
        }
    });

    it('has an entrypoint for each provided name', () => {
        const chunkCosts = getChunkCostsForEntrypoints(
            bundleGraph,
            exploreResult,
            [
                './packages/roosterjs-react-ribbon/lib/index.ts',
                './packages/roosterjs-react/lib/index.ts',
            ],
        );
        expect(chunkCosts.entrypoints).toEqual(
            jasmine.arrayContaining([
                jasmine.objectContaining({
                    name: './packages/roosterjs-react-ribbon/lib/index.ts',
                }),
                jasmine.objectContaining({
                    name: './packages/roosterjs-react/lib/index.ts',
                }),
            ]),
        );
    });

    it('matches the snapshots', () => {
        const chunkCosts = getChunkCostsForEntrypoints(
            bundleGraph,
            exploreResult,
            [
                './packages/roosterjs-react-ribbon/lib/index.ts',
                './packages/roosterjs-react/lib/index.ts',
            ],
        );
        expect(chunkCosts).toMatchSnapshot();
    });
});
