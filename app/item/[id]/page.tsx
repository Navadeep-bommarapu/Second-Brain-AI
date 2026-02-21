import { getKnowledgeItemById } from '@/lib/queries';
import { CardChat } from '@/app/components/CardChat';
import { notFound } from 'next/navigation';
import { Badge } from '@/app/components/ui/Badge';
import { format } from 'date-fns';
import { BookOpen, Link as LinkIcon, Lightbulb, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ItemActions } from '@/app/components/ItemActions';

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const itemId = parseInt(resolvedParams.id, 10);

    if (isNaN(itemId)) {
        notFound();
    }

    const item = await getKnowledgeItemById(itemId);

    if (!item) {
        notFound();
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'note': return <BookOpen className="w-4 h-4" />;
            case 'link': return <LinkIcon className="w-4 h-4" />;
            case 'insight': return <Lightbulb className="w-4 h-4 text-purple-500" />;
            default: return null;
        }
    };

    const tagsArray = item.tags ? (Array.isArray(item.tags) ? item.tags : item.tags.split(',').map((t: string) => t.trim()).filter(Boolean)) : [];
    const sourceMatch = item.content.match(/Source:\s*(https?:\/\/[^\s]+)/);
    const sourceUrl = sourceMatch ? sourceMatch[1] : null;
    const displayContent = item.content.replace(/Source:\s*(https?:\/\/[^\s]+)/, '').trim();

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6 flex items-center">
                <Link href="/" className="flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:h-full lg:min-h-0">
                {/* Left Column: Content */}
                <div className="flex-1 min-w-0 flex flex-col lg:overflow-y-auto lg:pr-6 lg:border-r border-neutral-100 dark:border-neutral-800 pb-4 lg:pb-10">
                    <div className="flex justify-between items-start gap-4 mb-4">
                        <Badge variant={item.type as any} className="capitalize flex gap-1.5 items-center">
                            {getTypeIcon(item.type)}
                            {item.type}
                        </Badge>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-neutral-400 tabular-nums">
                                {format(new Date(item.created_at), 'MMMM d, yyyy')}
                            </span>
                            <ItemActions itemId={item.id} />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight mb-6">{item.title}</h1>

                    {item.summary && (
                        <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl mb-8 border border-neutral-100 dark:border-neutral-800">
                            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 uppercase tracking-wide flex items-center gap-2">
                                ✨ AI Summary
                            </p>
                            <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {item.summary}
                            </p>
                        </div>
                    )}

                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap leading-relaxed">
                            {displayContent}
                        </p>
                    </div>

                    <div className="mt-12 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-2 justify-between items-center">
                        <div className="flex flex-wrap gap-2">
                            {tagsArray.map((tag, i) => (
                                <Badge key={i} variant="secondary" className="px-3 py-1 font-medium text-sm">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                        {sourceUrl && (
                            <a
                                href={sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                            >
                                Open Source Link <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Right Column: Contextual Chat */}
                <div className="w-full lg:w-[400px] xl:w-[500px] shrink-0 flex flex-col h-[500px] lg:h-[calc(100dvh-180px)] lg:sticky top-0 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm mb-8 lg:mb-0">
                    <CardChat itemId={item.id} />
                </div>
            </div>
        </div >
    );
}
