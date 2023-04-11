import type { Case } from "./types";
import { Icon } from "@coremyslo/svg-to-icon";
export interface Options {
    case: Case;
    optimize: boolean;
}
export declare class IconGenerator {
    static readonly optionsDefault: Options;
    sourceDirPath: string;
    readonly options: Options;
    icons: Map<string, Icon>;
    constructor(sourceDirPath: string, options?: Partial<Options>);
    read(sourcePath?: string): Promise<void>;
    delete(nameOrPath: string): void;
}
