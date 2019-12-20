import { SizeMap } from './types/SizeMap';
import { normalize as normalizePath } from 'path';

const getExtension = (p: string): string | null => {
    const lastIndexDot = p.lastIndexOf('.');
    const lastIndexSlash = p.lastIndexOf('/');
    if (lastIndexDot === -1 || lastIndexDot < lastIndexSlash) {
        return null;
    }
    return p.substring(lastIndexSlash);
};

export function fuzzyMatchNameToExploreResultName(
    sizeMap: SizeMap,
    entrypointName: string,
): string | null {
    let normalizedName = normalizePath(entrypointName).replace(/\\/g, '/');
    const extension = getExtension(normalizedName);
    if (extension) {
        normalizedName = normalizedName.substring(
            0,
            normalizedName.length - extension.length,
        );
    }

    for (let name of sizeMap.keys()) {
        if (name.indexOf(normalizedName) !== -1) {
            return name;
        }
    }
    return null;
}
