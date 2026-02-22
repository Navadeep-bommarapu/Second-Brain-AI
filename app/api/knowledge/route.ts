import { NextRequest, NextResponse } from 'next/server';
import { createKnowledgeItem, getKnowledgeItems } from '@/lib/queries';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type') || undefined;
    const search = searchParams.get('q') || undefined;
    const tag = searchParams.get('tag') || undefined;

    try {
        const items = await getKnowledgeItems(session.user.email, type, search, tag);
        return NextResponse.json(items);
    } catch (error) {
        console.error('Failed to fetch knowledge items:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

                const summaryResult = await model.generateContent(`Summarize the following content in 1-2 thoughtful sentences:\n\nTitle: ${title}\nContent:\n${content}`);
                summary = summaryResult.response.text().trim();

                if (!finalTags || finalTags.trim() === '') {
                    const tagsResult = await model.generateContent(`Extract exactly 3 concise, comma-separated tags (only letters and commas) from the following text:\n\nTitle: ${title}\nContent:\n${content}`);
                    finalTags = tagsResult.response.text().trim().replace(/\s+/g, '').toLowerCase(); // Clean up tags
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
            user_email: session.user.email,
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error('Failed to create knowledge item:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
