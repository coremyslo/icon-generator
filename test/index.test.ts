import { IconGenerator } from "../src";
import path from "node:path";

test("sourceDirPath validation: absolute path", () => {
    expect(() => new IconGenerator("")).toThrow("Only absolute path is allowed");
});
test("sourcePath validation: relation to root", async () => {
    await expect(async () => {
        const iconGenerator = new IconGenerator("/assets/icons");
        await iconGenerator.sync("/assets");
    }).rejects.toThrow("/assets is not belongs to /assets/icons");
});
test("sourcePath validation: nothing found", async () => {
    await expect(async () => {
        const iconGenerator = new IconGenerator("/assets");
        await iconGenerator.sync();
    }).rejects.toThrow("No icons found by path /assets");
});
test("sync & build", async () => {
    const iconGenerator = new IconGenerator(path.join(__dirname, "/assets"));
    expect(iconGenerator.icons.size).toBe(0);

    await iconGenerator.sync();
    expect(iconGenerator.icons.size).toBe(6);

    await iconGenerator.build();
    expect(iconGenerator.icons.size).toBe(4);

    const iconBeforeSync = iconGenerator.icons.get("icons-icon-user");
    expect(iconBeforeSync && iconBeforeSync.content).toBe("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"18\" height=\"18\"><path d=\"M15 2H3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zM9 4.75c1.24 0 2.25 1.01 2.25 2.25S10.24 9.25 9 9.25 6.75 8.24 6.75 7 7.76 4.75 9 4.75zM13.5 14h-9v-.75c0-1.5 3-2.25 4.5-2.25s4.5.75 4.5 2.25V14z\"/></svg>");
    await iconGenerator.sync(path.join(__dirname, "/assets/icons/icon-user.svg"));
    const iconAfterSync = iconGenerator.icons.get("icons-icon-user");
    expect(iconAfterSync && iconAfterSync.content).toBe("");

    const icon2BeforeSync = iconGenerator.icons.get("new-icon-bug");
    expect(icon2BeforeSync && icon2BeforeSync.content).toBe("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"18\" height=\"18\"><path d=\"M4 12c0 2.76 2.24 5 5 5s5-2.24 5-5V9H4v3zm7.95-8.91 1.5-1.5-.59-.59-1.65 1.65c-.67-.34-1.41-.54-2.21-.54s-1.54.2-2.21.54L5.14 1l-.58.59 1.5 1.5A4.948 4.948 0 0 0 4 7.11V8h10v-.89c0-1.66-.81-3.11-2.05-4.02zM7 6H6V5h1v1zm5 0h-1V5h1v1z\"/></svg>");
    await iconGenerator.sync(path.join(__dirname, "/assets/new"));
    const icon2AfterSync = iconGenerator.icons.get("new-icon-bug");
    expect(icon2AfterSync && icon2AfterSync.content).toBe("");

    const notExistingPath = path.join(__dirname, "/assets/test");

    await expect(async () => {
        await iconGenerator.sync(notExistingPath);
    }).rejects.toThrow(`No icons found by path ${notExistingPath}`);
});
