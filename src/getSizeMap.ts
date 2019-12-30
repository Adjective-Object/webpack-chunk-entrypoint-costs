import { ExploreResult } from 'source-map-explorer';
import { SizeMap } from './types/SizeMap';

export function getSizeMap(exploreResult: ExploreResult): SizeMap {
    const sizeMap: SizeMap = new Map<string, number>();
    for (const bundle of exploreResult.bundles) {
        for (const fileName in bundle.files) {
            // TODO dealing with null files in explored bundle
            // if (fileName === 'null') {
            //     console.warn(exploreResult);
            //     throw new Error(
            //         `error building size map: bundle.files ${bundle.bundleName} had null member`
            //     );
            // }
            sizeMap.set(fileName, bundle.files[fileName].size);
        }
    }
    return sizeMap;
}
