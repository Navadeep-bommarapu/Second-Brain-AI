'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Send, Bot, User, X } from 'lucide-react';

export function CardChat({ itemId, onClose }: { itemId: number; onClose?: () => void }) {
    const { messages, sendMessage, status, setMessages } = useChat({
        api: '/api/chat',
        body: { itemId }
    } as any);

    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isLoading = status === 'streaming' || status === 'submitted';

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleCustomSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const contentToSend = input;
        setInput('');

        // @ts-ignore
        await sendMessage({ role: 'user', content: contentToSend });
    };

    return (
        <div className="flex flex-col h-full bg-neutral-50/50 dark:bg-neutral-900/30">
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5" /> Contextual Brain
                </span>
                {onClose && (
                    <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800">
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 space-y-2 py-8">
                        <Bot className="w-8 h-8 opacity-20" />
                        <p className="text-sm">Ask about this specific item.</p>
                    </div>
                ) : (
                    messages.map((m: any) => (
                        <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${m.role === 'user'
                                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                                : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
                                }`}>
                                {m.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                            </div>
                            <div className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                                <div className={`px-3 py-2 text-sm rounded-xl ${m.role === 'user'
                                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-tr-sm'
                                    : 'bg-white border border-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 rounded-tl-sm'
                                    }`}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex gap-3">
                        <div className="shrink-0 w-6 h-6 rounded-full bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300 flex items-center justify-center">
                            <Bot className="w-3 h-3" />
                        </div>
                        <div className="bg-white border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 px-3 py-2 rounded-xl rounded-tl-sm flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-neutral-100 dark:border-neutral-800">
                <form className="flex w-full gap-2 items-center" onSubmit={handleCustomSubmit}>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about this..."
                        className="flex-1 rounded-full h-9 px-4 text-sm bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="rounded-full h-9 w-9 shrink-0 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200"
                        disabled={isLoading || !input.trim()}
                    >
                        <Send className="w-3.5 h-3.5" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
