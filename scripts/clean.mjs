import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const targets = ['dist', '.astro'];

async function removeTarget(target) {
  const fullPath = path.join(root, target);
  try {
    await fs.rm(fullPath, { recursive: true, force: true });
    console.log(`removed: ${target}`);
  } catch (error) {
    console.warn(`skip: ${target}`, error.message);
  }
}

await Promise.all(targets.map(removeTarget));
console.log('clean complete');
