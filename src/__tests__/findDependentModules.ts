import { findDependentModules } from '../findDependentModules';
import { join as joinPath } from 'path';
import { readFile } from 'mz/fs';
import { ModuleGraphWithReasons } from 'webpack-bundle-diff-add-reasons';

describe('findDependentModules', () => {
    // let inputBundleData: { code: string | Buffer; map: string | Buffer };
    let bundleGraph: ModuleGraphWithReasons;

    beforeEach(async () => {
        bundleGraph = JSON.parse(
            await readFile(
                joinPath(__dirname, 'test-data', 'derived', 'bundleStats.json'),
                'utf-8',
            ),
        ).graph;
    });

    it('loads the bundlestats correctly', () => {
        expect(bundleGraph).not.toBe(undefined);
    });

    it('finds dependent modules', () => {
        const dependencies = findDependentModules(
            bundleGraph,
            './sample/script/ribbonButtonRenderer.tsx',
        );
        expect(dependencies).toEqual(
            jasmine.arrayContaining(['./node_modules/react/index.js']),
        );
    });

    it('does not find parent modules', () => {
        const dependencies = findDependentModules(
            bundleGraph,
            './sample/script/ribbonButtonRenderer.tsx',
        );
        expect(dependencies).not.toEqual(
            jasmine.arrayContaining(['./sample/script/sample.tsx']),
        );
    });

    it('matches the snapshot', () => {
        const result = findDependentModules(
            bundleGraph,
            './sample/script/ribbonButtonRenderer.tsx',
        );
        expect(result).toMatchSnapshot();
    });
});
