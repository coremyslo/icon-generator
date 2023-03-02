"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconGenerator = void 0;
const svg_to_icon_1 = require("@coremyslo/svg-to-icon");
const node_path_1 = __importDefault(require("node:path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
class IconGenerator {
    constructor(sourceDirPath, options = {}) {
        this.sourceDirPath = "";
        this.options = {
            case: "kebab",
            optimize: true,
        };
        this.icons = new Map();
        if (!node_path_1.default.isAbsolute(sourceDirPath)) {
            throw new Error("Only absolute path is allowed");
        }
        this.sourceDirPath = sourceDirPath;
        this.options = Object.assign(Object.assign({}, this.options), options);
    }
    sync(sourcePath = this.sourceDirPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (sourcePath) {
                if (!node_path_1.default.isAbsolute(sourcePath)) {
                    throw new Error("Only absolute path is allowed");
                }
                const relative = node_path_1.default.relative(this.sourceDirPath, sourcePath);
                if (relative.startsWith("..") || node_path_1.default.isAbsolute(relative)) {
                    throw new Error(`${sourcePath} is not belongs to ${this.sourceDirPath}`);
                }
            }
            const workingPath = node_path_1.default.parse(sourcePath).ext ? sourcePath : `${sourcePath}/**/*.svg`;
            const sourceFilePaths = yield (0, fast_glob_1.default)(workingPath);
            if (sourceFilePaths.length) {
                for (const sourceFilePath of sourceFilePaths) {
                    const icon = new svg_to_icon_1.Icon(sourceFilePath, {
                        case: this.options.case,
                        sourceDirPath: this.sourceDirPath,
                    });
                    this.icons.set(icon.name, icon);
                }
            }
            else {
                throw new Error(`No icons found by path ${sourcePath}`);
            }
        });
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([...this.icons].map(([name, icon]) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (!icon.content) {
                        yield icon.read();
                        if (this.options.optimize) {
                            icon.optimize();
                        }
                    }
                }
                catch (e) {
                    this.icons.delete(name);
                }
            })));
        });
    }
}
exports.IconGenerator = IconGenerator;
