import type { Case } from "./types";
import { Icon } from "@coremyslo/svg-to-icon";
import path from "node:path";
import fg from "fast-glob";

export interface Options {
    case: Case;
    optimize: boolean;
}

export class IconGenerator {
    public sourceDirPath = "";

    public readonly options: Options = {
        case: "kebab",
        optimize: true,
    };

    public icons = new Map<string, Icon>();

    public constructor (sourceDirPath: string, options: Partial<Options> = {}) {
        if (!path.isAbsolute(sourceDirPath)) {
            throw new Error("Only absolute path is allowed");
        }
        this.sourceDirPath = sourceDirPath;
        this.options = { ...this.options, ...options };
    }

    public async read (sourcePath = this.sourceDirPath): Promise<void> {
        if (sourcePath) {
            if (!path.isAbsolute(sourcePath)) {
                throw new Error("Only absolute path is allowed");
            }
            const relative = path.relative(this.sourceDirPath, sourcePath);
            if (relative.startsWith("..") || path.isAbsolute(relative)) {
                throw new Error(`${sourcePath} is not belongs to ${this.sourceDirPath}`);
            }
        }
        const workingPath = path.parse(sourcePath).ext ? sourcePath : `${sourcePath}/**/*.svg`;
        const sourceFilePaths = await fg(workingPath);
        if (sourceFilePaths.length) {
            for (const sourceFilePath of sourceFilePaths) {
                const icon = new Icon(sourceFilePath, {
                    case: this.options.case,
                    sourceDirPath: this.sourceDirPath,
                });
                this.icons.set(icon.name, icon);
            }
        } else {
            throw new Error(`No icons found by path ${sourcePath}`);
        }
        await Promise.all([...this.icons].map(async ([name, icon]) => {
            try {
                if (!icon.content) {
                    await icon.read();
                    if (this.options.optimize) {
                        icon.optimize();
                    }
                }
            } catch (e) {
                this.icons.delete(name);
            }
        }));
    }
}
