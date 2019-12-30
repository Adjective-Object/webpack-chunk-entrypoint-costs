import { explore, ExploreResult } from 'source-map-explorer';
import { SizeMap } from '../types/SizeMap';
import { getSizeMap } from '../getSizeMap';
import { join as joinPath } from 'path';

describe('getSizeMap', () => {
    let exploreResult: ExploreResult;

    beforeEach(async () => {
        if (exploreResult == null) {
            exploreResult = await explore([
                joinPath(__dirname, './test-data/FocusOutShellSample.js'),
                joinPath(__dirname, './test-data/FocusOutShellSample.map'),
            ]);
        }
    });

    it('matches the snapshot', () => {
        const sizeMap: SizeMap = getSizeMap(exploreResult);
        expect(sizeMap).toMatchSnapshot();
    });
});
