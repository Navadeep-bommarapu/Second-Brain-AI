import { config } from 'dotenv';
config({ path: '.env.local' });
import { createKnowledgeItem } from '../lib/queries';

async function test() {
    try {
        console.log('Testing createKnowledgeItem directly...');
        const item = await createKnowledgeItem({
            title: 'Test Title',
            content: 'Test content directly to DB',
            type: 'note',
            tags: 'test, tags',
            summary: 'Test summary'
        });
        console.log('Success:', item);
    } catch (err) {
        console.error('Database Error:', err);
    }
    process.exit();
}

test();
