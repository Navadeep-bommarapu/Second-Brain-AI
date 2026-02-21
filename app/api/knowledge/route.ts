import { NextRequest, NextResponse } from 'next/server';
import { createKnowledgeItem, getKnowledgeItems } from '@/lib/queries';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY || '',
});

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type') || undefined;
    const search = searchParams.get('q') || undefined;
    const tag = searchParams.get('tag') || undefined;

    try {
        const items = await getKnowledgeItems(type, search, tag);
        return NextResponse.json(items);
    } catch (error) {
        console.error('Failed to fetch knowledge items:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, content, type, tags, url } = body;

        if (!title || !content || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let finalTags = tags || '';
        let summary = '';

        // Attempt AI Summarization & Auto-tagging if GOOGLE_API_KEY is present
        if (process.env.GOOGLE_API_KEY) {
            try {
                const { text: generatedSummary } = await generateText({
                    model: google('gemini-2.5-flash'),
                    prompt: `Summarize the following content in 1-2 thoughtful sentences:\n\nTitle: ${title}\nContent:\n${content}`,
                });
                summary = generatedSummary.trim();

                if (!finalTags || finalTags.trim() === '') {
                    const { text: generatedTags } = await generateText({
                        model: google('gemini-2.5-flash'),
                        prompt: `Extract exactly 3 concise, comma-separated tags (only letters and commas) from the following text:\n\nTitle: ${title}\nContent:\n${content}`,
                    });
                    finalTags = generatedTags.trim().replace(/\s+/g, '').toLowerCase(); // Clean up tags
                }
            } catch (aiError) {
                console.error('AI Processing Error (Skipping enhancements):', aiError);
                // Fallback if AI fails: leave summary empty, tags as is
            }
        } else {
            console.warn('GOOGLE_API_KEY is not set. Skipping AI enhancements.');
        }

        // Append URL into content if provided, as the DB schema doesn't have a URL column
        let finalContent = content;
        if (url) {
            finalContent = `${content}\n\nSource: ${url}`;
        }

        const newItem = await createKnowledgeItem({
            title,
            content: finalContent,
            type,
            tags: finalTags,
            summary,
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error('Failed to create knowledge item:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
