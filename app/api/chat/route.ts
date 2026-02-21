import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getKnowledgeItemById } from '@/lib/queries';

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY || '',
});

export async function POST(req: Request) {
    try {
        const { messages, itemId } = await req.json();

        if (!process.env.GOOGLE_API_KEY) {
            return new Response(JSON.stringify({ error: 'Google API key not configured.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        let contextString = 'No specific context provided. You are a general AI assistant.';

        if (itemId) {
            const item = await getKnowledgeItemById(Number(itemId));
            if (item) {
                contextString = `
                You are discussing a specific item from the user's knowledge base.
                Title: ${item.title}
                Type: ${item.type}
                Summary: ${item.summary || 'None'}
                Content: ${item.content}
                `;
            }
        }

        const systemPrompt = `
      You are an intelligent "Second Brain" assistant. Your goal is to help the user query, synthesize, and retrieve insights from their personal knowledge base.
      
      Current Focus Context:
      ${contextString}
      
      Answer the user's queries specifically regarding the focused context if applicable. Keep your responses concise, helpful, and formatted beautifully using markdown.
    `;

        const formattedMessages = messages.map((m: any) => ({
            role: m.role,
            content: m.content
        }));

        const result = await streamText({
            model: google('gemini-2.5-flash'),
            system: systemPrompt,
            messages: formattedMessages,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
