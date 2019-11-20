import { getSummedModuleCost } from '../getSummedModuleCost';
import { explore, ExploreResult } from 'source-map-explorer';
import { SizeMap } from '../types/SizeMap';
import { getSizeMap } from '../getSizeMap';
import { join as joinPath } from 'path';

describe('getSummedModuleCost', () => {
    let exploreResult: ExploreResult;
    let sizeMap: SizeMap;

    beforeEach(async () => {
        exploreResult = await explore([
            joinPath(__dirname, './test-data/FocusOutShellSample.js'),
            joinPath(__dirname, './test-data/FocusOutShellSample.map'),
        ]);
        sizeMap = getSizeMap(exploreResult);
    });

    it('gets the cost of an individual module', () => {
        const { totalCost: reactIndexCost } = getSummedModuleCost(sizeMap, [
            './node_modules/react/index.js',
        ]);
        expect(reactIndexCost).toEqual(
            sizeMap.get('webpack:///node_modules/react/index.js'),
        );
        expect(reactIndexCost).not.toBe(0);
    });

    it('gets the cost of multiple modules', () => {
        const { totalCost: summedCost } = getSummedModuleCost(sizeMap, [
            './node_modules/react/index.js',
            './node_modules/react-dom/index.js',
        ]);

        const reactCost = sizeMap.get('webpack:///node_modules/react/index.js');
        const reactDomCost = sizeMap.get(
            'webpack:///node_modules/react-dom/index.js',
        );

        if (reactCost === undefined || reactDomCost === undefined) {
            throw new Error(
                `reactCost = ${reactCost}, reactDomCost = ${reactDomCost}`,
            );
        }
        expect(summedCost).toEqual(reactCost + reactDomCost);
    });
});
