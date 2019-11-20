/**
 * Cost information associated with a given entry point module.
 */
export interface EntrypointCost {
    /**
     * Name of the entry point module
     */
    name: string;
    /**
     * Total downstream cost of this entry point
     */
    downstreamCost: number;
    /**
     * Names of all the modules present in the source map that are in the
     * dependencies (indirect or otherwise) of this entry point
     */
    dependencyNames: string[];
    /**
     * Names of modules that were present in the dependencies of
     * this module, but were not present in the source map.
     *
     * This might mean that the module was pruned from the build.
     */
    missingModuleNames: string[];
}
