import { GoogleGenerativeAI } from '@google/generative-ai';
import { getKnowledgeItemById } from '@/lib/queries';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const maxDuration = 30;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

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
            const item = await getKnowledgeItemById(Number(itemId), session.user.email);
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

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt
        });

        const history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content || (m.parts && m.parts.length > 0 ? m.parts[0].text : '') }]
        }));

        const lastMessage = messages[messages.length - 1];
        const prompt = lastMessage.content || (lastMessage.parts && lastMessage.parts.length > 0 ? lastMessage.parts[0].text : '');

        const chat = model.startChat({ history });
        const result = await chat.sendMessageStream(prompt);

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        if (chunkText) {
                            controller.enqueue(encoder.encode(chunkText));
                        }
                    }
                    controller.close();
                } catch (e) {
                    controller.error(e);
                }
            }
        });

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked'
            }
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
