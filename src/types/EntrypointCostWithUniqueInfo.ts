import { EntrypointCost } from './EntrypointCost';

/**
 * Cost information associated with a given entry point module, in the
 * context of a number of shared entry points in the same chunk
 */
export interface EntrypointCostWithUniqueInfo extends EntrypointCost {
    /**
     * Cost of the modules that are unique to this entry point among
     * the other entry points in the same `ChunkCosts` structure
     */
    uniqueDownstreamCost: number;
    /**
     * Names of this entry point module's dependencies (indirect or otherwise)
     * that are unique to this entry point (e.g. not shared by the same `ChunkCosts`
     * structure)
     */
    uniqueDependencyNames: string[];
}
