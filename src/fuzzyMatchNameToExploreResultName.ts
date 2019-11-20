import { SizeMap } from './types/SizeMap';

export function fuzzyMatchNameToExploreResultName(
    sizeMap: SizeMap,
    entrypointName: string
): string | null {
    // TODO
    for (let name in sizeMap) {
        console.log(name, entrypointName);
    }
    return entrypointName;
}
