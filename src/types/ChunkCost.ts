import { EntrypointCostWithUniqueInfo } from './EntrypointCostWithUniqueInfo';
import { ModuleCost } from './ModuleCost';

export interface ChunkCost {
    entrypoints: EntrypointCostWithUniqueInfo[];
    modules: Record<string, ModuleCost>;
}
