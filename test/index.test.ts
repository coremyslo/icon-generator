import { IconGenerator } from "../src";
import path from "node:path";

test("sourceDirPath validation: absolute path", () => {
    expect(() => new IconGenerator("")).toThrow("Only absolute path is allowed");
});
test("sourcePath validation: relation to root", async () => {
    await expect(async () => {
        const iconGenerator = new IconGenerator("/assets/icons");
        await iconGenerator.read("/assets");
    }).rejects.toThrow("/assets is not belongs to /assets/icons");
});
test("sourcePath validation: nothing found", async () => {
    await expect(async () => {
        const iconGenerator = new IconGenerator("/assets");
        await iconGenerator.read();
    }).rejects.toThrow("No icons found by path /assets");
});
test("read", async () => {
    const iconGenerator = new IconGenerator(path.join(__dirname, "/assets"));
    expect(iconGenerator.icons.size).toBe(0);

    await iconGenerator.read();
    expect(iconGenerator.icons.size).toBe(4);

    const notExistingPath = path.join(__dirname, "/assets/test");
    await expect(async () => {
        await iconGenerator.read(notExistingPath);
    }).rejects.toThrow(`No icons found by path ${notExistingPath}`);
});
