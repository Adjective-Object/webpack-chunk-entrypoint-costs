import { SizeMap } from './types/SizeMap';
import { normalize as normalizePath } from 'path';

export function fuzzyMatchNameToExploreResultName(
    sizeMap: SizeMap,
    entrypointName: string
): string | null {
    const normalizedName = normalizePath(entrypointName).replace(/\\/g, '/');
    for (let name of sizeMap.keys()) {
        if (name.indexOf(normalizedName) !== -1) {
            return name;
        }
    }
    return null;
}
