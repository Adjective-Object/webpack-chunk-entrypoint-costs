import { SizeMap } from './types/SizeMap';
import { ChunkCost } from './types/ChunkCost';
import { ModuleCost } from './types/ModuleCost';
import { EntrypointCost } from './types/EntrypointCost';
import { EntrypointCostWithUniqueInfo } from './types/EntrypointCostWithUniqueInfo';
import { ExploreResult } from 'source-map-explorer';
import { ModuleGraphWithReasons } from 'webpack-bundle-diff-add-reasons';
import { findDependentModules } from './findDependentModules';
import { getSummedModuleCost } from './getSummedModuleCost';
import { getSizeMap } from './getSizeMap';

export function getChunkCostsForEntrypoints(
    bundleGraph: ModuleGraphWithReasons,
    exploreResult: ExploreResult,
    entrypointNames: string[],
): ChunkCost {
    const moduleSizeMap = getSizeMap(exploreResult);

    const entrypointCosts: Record<string, EntrypointCost> = {};
    const allDepenedantModuleNames = new Set<string>();
    for (let entrypointName of entrypointNames) {
        const dependencyNames = findDependentModules(
            bundleGraph,
            entrypointName,
        );

        dependencyNames.forEach((dependancy: string) =>
            allDepenedantModuleNames.add(dependancy),
        );

        const summedModuleCost = getSummedModuleCost(
            moduleSizeMap,
            dependencyNames,
        );
        entrypointCosts[entrypointName] = {
            name: entrypointName,
            dependencyNames,
            downstreamCost: summedModuleCost.totalCost,
            missingModuleNames: summedModuleCost.missingModuleNames,
        };
    }

    // get the unique deps & costs for each entry point
    const entrypointsWithUnique: EntrypointCostWithUniqueInfo[] = [];
    for (let entrypointCostName in entrypointCosts) {
        const entrypointCost = entrypointCosts[entrypointCostName];
        const uniqueDependencies = new Set(entrypointCost.dependencyNames);
        for (let comparedEntrypointCostName in entrypointCosts) {
            if (comparedEntrypointCostName != entrypointCostName) {
                const comparisonCost =
                    entrypointCosts[comparedEntrypointCostName];
                comparisonCost.dependencyNames.forEach(
                    comparisonDependencyName => {
                        uniqueDependencies.delete(comparisonDependencyName);
                    },
                );
            }
        }
        const uniqueDependencyNamesArray = Array.from(uniqueDependencies);
        const uniqueCost = getSummedModuleCost(
            moduleSizeMap,
            uniqueDependencyNamesArray,
        );
        entrypointsWithUnique.push({
            ...entrypointCost,
            uniqueDependencyNames: uniqueDependencyNamesArray,
            uniqueDownstreamCost: uniqueCost.totalCost,
        });
    }

    return {
        entrypoints: entrypointsWithUnique,
        modules: getModuleSizeRecordObject(moduleSizeMap),
    };
}

export function getModuleSizeRecordObject(
    sizeMap: SizeMap,
): Record<string, ModuleCost> {
    const record: Record<string, ModuleCost> = {};
    for (let key of sizeMap.keys()) {
        const size = sizeMap.get(key);
        if (size !== undefined) {
            record[key] = {
                individualCost: size,
            };
        }
    }
    return record;
}
