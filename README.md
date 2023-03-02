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
// reads and optimizes all icons added
await iconGenerator.build();

// refreshes only icons in a specific subdirectory
await iconGenerator.sync(path.join(__dirname, "/assets/icons"));
// same but for a file
await iconGenerator.sync(path.join(__dirname, "/assets/icons/icon-home.svg"));
// reads and optimizes only refreshed icons
await iconGenerator.build();

// returns a list of icons as a Map
console.log(iconGenerator.icons)
```

## API
### `new iconGenerator(sourceDirPath, options)`
* `sourceDirPath: string` - Absolute path to the directory with icons.
* `options` - An optional object with parameters:
  * `case: "snake" | "pascal" | "camel" | "kebab" | "header" | "constant"` - Optional, `kebab` by default. Defines the case for icon name. See [case](https://www.npmjs.com/package/case) package for details.
  * `optimize: boolean;` - Optional, `true` by default. Defines whether the icons should be optimized after reading or not.

### `sync(sourcePath = this.sourceDirPath): Promise<void>`
Asynchronous. Creates and adds an icon object to `icons` and sets the name, but doesn't read the file(s).

### `build(): Promise<void>`
Asynchronous. Reads and optimizes all SVG files in directory passed in the constructor.

### `icons: Map<string, Icon>`
Returns a Map of icons, where the key is a name based on the icon path, and the value is [Icon](https://github.com/coremyslo/svg-to-icon) object.
* `options: object` options passed to node's [Readable.from](https://nodejs.org/api/stream.html#streamreadablefromiterable-options) under the hood. This method is used to generate a glyph from the SVG icon.
