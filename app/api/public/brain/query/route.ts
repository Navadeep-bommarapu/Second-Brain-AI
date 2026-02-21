import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getKnowledgeItems } from '@/lib/queries';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY || '',
});

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Missing "q" search parameter.' }, { status: 400 });
    }

    try {
        const items = await getKnowledgeItems(undefined, query); // Use basic search for now

        // Take the top 5 most relevant items for the public query
        const relevantItems = items.slice(0, 5);
        const sources = relevantItems.map(item => ({
            id: item.id,
            title: item.title,
            type: item.type,
            summary: item.summary,
            url: `/dashboard?item=${item.id}` // Mock URL to view details
        }));

        let answer = "No matching information found in the knowledge base.";

        if (relevantItems.length > 0 && process.env.GOOGLE_API_KEY) {
            const contextString = relevantItems.map(item => `Title: ${item.title}\nContent: ${item.content}`).join('\n\n');

            const { text } = await generateText({
                model: google('gemini-2.5-flash'),
                prompt: `You are answering a query from a user's personal knowledge base.\n\nQuery: ${query}\n\nContext:\n${contextString}\n\nAnswer concisely based ONLY on the provided context.`,
            });
            answer = text.trim();
        } else if (relevantItems.length > 0) {
            answer = `Found ${relevantItems.length} related items, but AI synthesis is disabled.`;
        }

        return NextResponse.json({
            answer,
            sources,
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*', // Public endpoint
            }
        });

    } catch (error) {
        console.error('Public API Error:', error);
        return NextResponse.json({ error: 'Failed to process public query.' }, { status: 500 });
    }
}
