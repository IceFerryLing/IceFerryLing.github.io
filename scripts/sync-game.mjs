import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'major-galgame-demo');
const target = path.join(root, 'public', 'major-galgame-demo');

await fs.rm(target, { recursive: true, force: true });
await fs.cp(source, target, { recursive: true });

console.log('synced major-galgame-demo -> public/major-galgame-demo');
