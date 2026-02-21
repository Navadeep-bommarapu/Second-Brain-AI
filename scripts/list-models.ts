import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config({ path: '.env.local' });

async function listModels() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
    } catch (e) {
        fs.writeFileSync('models.json', JSON.stringify({ error: String(e) }));
    }
}
listModels();
