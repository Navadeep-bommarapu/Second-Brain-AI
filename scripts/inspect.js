import { renderHook } from '@testing-library/react-hooks';
// The project doesn't have testing-library.

import fs from 'fs';
import path from 'path';

const file = fs.readFileSync(path.join(process.cwd(), 'node_modules/@ai-sdk/react/dist/index.d.ts'), 'utf-8');
const lines = file.split('\n');
let helpers = false;
for (const line of lines) {
    if (line.includes('UseChatHelpers')) {
        helpers = true;
    }
}
fs.writeFileSync('keys.txt', 'done');
