import pool from './db';

export interface KnowledgeItem {
    id: number;
    title: string;
    content: string;
    type: 'note' | 'link' | 'insight';
    tags: string | string[]; // Can be comma-separated or JSON array depending on DB
    summary?: string;
    created_at: Date;
}

export type NewKnowledgeItem = Omit<KnowledgeItem, 'id' | 'created_at'>;

export async function createKnowledgeItem(item: NewKnowledgeItem): Promise<KnowledgeItem> {
    const client = await pool.connect();
    try {
        const query = `
      INSERT INTO knowledge (title, content, type, tags, summary)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

        // Normalize tags to array format for Postgres TEXT[] type insertion
        let tagsValue: string[] = [];
        if (Array.isArray(item.tags)) {
            tagsValue = item.tags;
        } else if (typeof item.tags === 'string' && item.tags.trim() !== '') {
            tagsValue = item.tags.split(',').map(t => t.trim()).filter(Boolean);
        }

        const values = [item.title, item.content, item.type, tagsValue, item.summary || null];
        const result = await client.query(query, values);

        return result.rows[0];
    } finally {
        client.release();
    }
}

export async function getKnowledgeItems(type?: string, search?: string, tag?: string): Promise<KnowledgeItem[]> {
    const client = await pool.connect();
    try {
        let query = 'SELECT * FROM knowledge WHERE 1=1';
        const values: any[] = [];
        let valueCount = 1;

        if (type && type !== 'all') {
            query += ` AND type = $${valueCount}`;
            values.push(type);
            valueCount++;
        }

        if (search) {
            query += ` AND (title ILIKE $${valueCount} OR content ILIKE $${valueCount})`;
            const searchPattern = `%${search}%`;
            values.push(searchPattern);
            valueCount++;
        }

        if (tag) {
            // Search inside the TEXT[] array for any tag matching the pattern
            query += ` AND EXISTS (SELECT 1 FROM unnest(tags) AS t WHERE t ILIKE $${valueCount})`;
            const tagPattern = `%${tag}%`;
            values.push(tagPattern);
            valueCount++;
        }

        query += ' ORDER BY created_at DESC';

        const result = await client.query(query, values);
        return result.rows;
    } finally {
        client.release();
    }
}

export async function getKnowledgeItemById(id: number): Promise<KnowledgeItem | undefined> {
    const client = await pool.connect();
    try {
        const query = 'SELECT * FROM knowledge WHERE id = $1';
        const result = await client.query(query, [id]);
        return result.rows[0];
    } finally {
        client.release();
    }
}
