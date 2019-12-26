import { SizeMap } from './types/SizeMap';

const getExtension = (p: string): string | null => {
    const lastIndexDot = p.lastIndexOf('.');
    const lastIndexSlash = p.lastIndexOf('/');
    if (lastIndexDot === -1 || lastIndexDot < lastIndexSlash) {
        return null;
    }
    return p.substring(lastIndexSlash);
};

const normalizePath = (p: string): string =>
    p
        .replace(/\\/g, '/')
        .replace(/\/+/, '/')
        .replace(/^\.\//, '');

export function fuzzyMatchNameToExploreResultName(
    sizeMap: SizeMap,
    entrypointName: string,
): string | null {
    let normalizedName = normalizePath(entrypointName);
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
