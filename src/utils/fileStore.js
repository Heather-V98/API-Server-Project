const fs = require("fs/promises");
const path = require("path");

let writeLock = Promise.resolve();

function withWriteLock(fn) {
  writeLock = writeLock.then(fn, fn);
  return writeLock;
}

async function readJson(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function writeJsonAtomic(filePath, data) {
  const dir = path.dirname(filePath);
  const tmpPath = path.join(dir, `${path.basename(filePath)}.tmp`);
  const json = JSON.stringify(data, null, 2);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(tmpPath, json, "utf-8");
  await fs.rename(tmpPath, filePath);
}

async function updateJson(filePath, updaterFn) {
  return withWriteLock(async () => {
    const current = await readJson(filePath);
    const updated = await updaterFn(current);

    // Require arrays for this assignment’s files
    if (!Array.isArray(updated)) {
      const err = new Error("Data store must be an array.");
      err.status = 500;
      throw err;
    }

    await writeJsonAtomic(filePath, updated);
    return updated;
  });
}

module.exports = {
  readJson,
  updateJson
};
