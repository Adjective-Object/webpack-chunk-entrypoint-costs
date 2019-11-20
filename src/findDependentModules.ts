import { ModuleGraphWithReasons } from 'webpack-bundle-diff-add-reasons';

export function findDependentModules(
    bundleGraph: ModuleGraphWithReasons,
    entrypoint: string
): string[] {
    let traversedModules = new Set<string>();
    let frontier = [entrypoint];
    while (frontier.length) {
        const thisModuleName = frontier.pop();
        if (!thisModuleName) {
            throw new Error('non-emtpy module frontier popped undefined');
        }
        traversedModules.add(thisModuleName);

        const thisNode = bundleGraph[thisModuleName];
        if (!thisNode) {
            throw new Error(
                `could not get module node for node name ${thisNode}`
            );
        }

        const nextChildren = thisNode.reasonChildren.filter(
            nodeName =>
                frontier.indexOf(nodeName) === -1 &&
                !traversedModules.has(nodeName)
        );
        frontier = frontier.concat(nextChildren);
    }

    return Array.from(traversedModules);
}
