import { fuzzyMatchNameToExploreResultName } from '../fuzzyMatchNameToExploreResultName';
import { explore, ExploreResult } from 'source-map-explorer';
import { SizeMap } from '../types/SizeMap';
import { getSizeMap } from '../getSizeMap';
import { join as joinPath } from 'path';
import { readFile } from 'mz/fs';

describe('fuzzyMatchNameToExploreResultName', () => {
    let inputBundleData: { code: string; map: string };
    let exploreResult: ExploreResult;

    beforeEach(async () => {
        inputBundleData = {
            code: await readFile(
                joinPath(__dirname, './test-data/FocusOutShellSample.js'),
                'utf-8'
            ),
            map: await readFile(
                joinPath(__dirname, './test-data/FocusOutShellSample.map'),
                'utf-8'
            )
        };

        exploreResult = await explore(inputBundleData);
    });

    it('fuzzy matches for some entry in the bundle', () => {
        const sizeMap: SizeMap = getSizeMap(exploreResult);

        const fuzzyMatch = fuzzyMatchNameToExploreResultName(
            sizeMap,
            './node_modules/react-dom/index.js'
        );

        expect(fuzzyMatch).not.toBe(null);
        expect(sizeMap.has(fuzzyMatch!)).toBe(true);
    });
});
