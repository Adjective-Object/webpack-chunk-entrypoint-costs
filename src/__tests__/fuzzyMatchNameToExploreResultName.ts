import { fuzzyMatchNameToExploreResultName } from '../fuzzyMatchNameToExploreResultName';
import { explore, ExploreResult } from 'source-map-explorer';
import { SizeMap } from '../types/SizeMap';
import { getSizeMap } from '../getSizeMap';
import { join as joinPath } from 'path';

describe('fuzzyMatchNameToExploreResultName', () => {
    // let inputBundleData: { code: string | Buffer; map: string | Buffer };
    let exploreResult: ExploreResult;

    beforeEach(async () => {
        exploreResult = await explore([
            joinPath(__dirname, './test-data/FocusOutShellSample.js'),
            joinPath(__dirname, './test-data/FocusOutShellSample.map'),
        ]);
    });

    it('fuzzy matches names in the bundle to names from the sizeMap', () => {
        const sizeMap: SizeMap = getSizeMap(exploreResult);
        const fuzzyMatch = fuzzyMatchNameToExploreResultName(
            sizeMap,
            './node_modules/react/index.js',
        );
        expect(fuzzyMatch).toBe('webpack:///node_modules/react/index.js');
    });

    it('fuzzy matches some exact name', () => {
        const sizeMap: SizeMap = getSizeMap(exploreResult);
        const fuzzyMatch = fuzzyMatchNameToExploreResultName(
            sizeMap,
            './node_modules/react-dom/index.js',
        );
        expect(fuzzyMatch).not.toBe(null);
        expect(sizeMap.has(fuzzyMatch!)).toBe(true);
    });
});
