import { SizeMap } from './types/SizeMap';
import { fuzzyMatchNameToExploreResultName } from './fuzzyMatchNameToExploreResultName';

/**
 * Fuzzy match the modules from `modules` against modules found in the source map, then
 */
export function getSummedModuleCost(
    sizeMap: SizeMap,
    moduleNames: string[]
): number | null {
    let downstreamCost = 0;

    for (let moduleName in moduleNames) {
        const fuzzyMatchedNameFromSizeMap = fuzzyMatchNameToExploreResultName(
            sizeMap,
            moduleName
        );
        if (fuzzyMatchedNameFromSizeMap === null) {
            console.warn('failed to fuzzy match for', moduleName, sizeMap);
            return null;
        }
        const size = sizeMap.get(fuzzyMatchedNameFromSizeMap);
        if (size === undefined) {
            throw new Error(
                `failed to get size for fuzzy matched name ${fuzzyMatchedNameFromSizeMap}`
            );
        }
        downstreamCost += size;
    }

    return downstreamCost;
}
