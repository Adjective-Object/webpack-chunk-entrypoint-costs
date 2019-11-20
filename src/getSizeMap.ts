import { ExploreResult } from 'source-map-explorer';
import { SizeMap } from './types/SizeMap';

export function getSizeMap(exploreResult: ExploreResult): SizeMap {
    const sizeMap: SizeMap = new Map<string, number>();
    for (const bundle of exploreResult.bundles) {
        for (const fileName in bundle.files) {
            sizeMap.set(fileName, bundle.files[fileName]);
        }
    }
    return sizeMap;
}
