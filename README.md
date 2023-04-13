# @coremyslo/icon-generator [![npm](https://img.shields.io/npm/v/@coremyslo/svg-to-icon)](https://www.npmjs.com/package/@coremyslo/svg-to-icon) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/coremyslo/svg-to-icon/blob/master/LICENSE)

This module provides a helper class for reading and optimizing multiple SVG files located in the same directory (subdirectories are allowed). It returns their names based on path and file content and generates optimized content with glyphs.

## Installation

```shell
$ yarn add @coremyslo/icon-generator
```


## Usage
```typescript
import { IconGenerator } from "@coremyslo/svg-to-icon";

// adds all icons from the directory to internal `iconGenerator.icons` but doesn't read them
const iconGenerator = new IconGenerator(path.join(__dirname, "/assets"));

// reads and optimizes all icons from directory specified in constructor
await iconGenerator.read();

// reads and optimizes only icons in a specific subdirectory
await iconGenerator.read(path.join(__dirname, "/assets/icons"));

// reads and optimizes only the icon for a specific file.
await iconGenerator.read(path.join(__dirname, "/assets/icons/icon-home.svg"));

// returns a list of icons as a Map
console.log(iconGenerator.icons)
```

## API
### `new iconGenerator(sourceDirPath, options)`
* `sourceDirPath: string` - Absolute path to the directory with icons.
* `options` - An optional object with parameters:
  * `case: "snake" | "pascal" | "camel" | "kebab" | "header" | "constant"` - Optional, `kebab` by default. Defines the case for icon name. See [case](https://www.npmjs.com/package/case) package for details.
  * `optimize: boolean;` - Optional, `true` by default. Defines whether the icons should be optimized after reading or not.

### `read(sourcePath = this.sourceDirPath): Promise<void>`
Asynchronous. Reads and optimizes all SVG files in directory passed in the constructor or subdirectory of file passed as an argument.

### `update(nameOrPath: string): Promise<void>`
Asynchronous. Reads and optimizes icon.

### `delete(nameOrPath: string): void`
Deletes icon from the internal `icons` Map by name or path.

### `icons: Map<string, Icon>`
Returns a Map of icons, where the key is a name based on the icon path, and the value is [Icon](https://www.npmjs.com/package/@coremyslo/svg-to-icon) class.
