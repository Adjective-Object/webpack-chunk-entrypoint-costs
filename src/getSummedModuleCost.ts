import { SizeMap } from './types/SizeMap';
import { fuzzyMatchNameToExploreResultName } from './fuzzyMatchNameToExploreResultName';

export interface SummedModuleCosts {
    totalCost: number;
    missingModuleNames: string[];
}

/**
 * Fuzzy match the modules from `modules` against modules found in the source map
 * and sum their costs.
 *
 * This gets the cost of the _individual_ costs of the listed modules
 */
export function getSummedModuleCost(
    sizeMap: SizeMap,
    moduleNames: string[],
): SummedModuleCosts {
    let totalCost = 0;
    let missingModuleNames = [];

    for (let moduleName of moduleNames) {
        const fuzzyMatchedNameFromSizeMap = fuzzyMatchNameToExploreResultName(
            sizeMap,
            moduleName,
        );
        if (fuzzyMatchedNameFromSizeMap === null) {
            missingModuleNames.push(moduleName);
            continue;
        }
        const size = sizeMap.get(fuzzyMatchedNameFromSizeMap);
        if (size === undefined) {
            throw new Error(
                `failed to get size for fuzzy matched name ${fuzzyMatchedNameFromSizeMap}`,
            );
        }
        totalCost += size;
    }

    return {
        totalCost: totalCost,
        missingModuleNames,
    };
}
