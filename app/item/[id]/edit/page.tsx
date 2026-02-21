import { getKnowledgeItemById } from '@/lib/queries';
import { notFound } from 'next/navigation';
import { EditForm } from '@/app/components/EditForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const itemId = parseInt(resolvedParams.id, 10);

    if (isNaN(itemId)) {
        notFound();
    }

    const item = await getKnowledgeItemById(itemId);

    if (!item) {
        notFound();
    }

    // Extract raw URL from content if a source was appended originally
    const sourceMatch = item.content.match(/Source:\s*(https?:\/\/[^\s]+)/);
    const sourceUrl = sourceMatch ? sourceMatch[1] : '';
    const cleanContent = item.content.replace(/Source:\s*(https?:\/\/[^\s]+)/, '').trim();

    // Map tags array back to comma-separated string for the input form
    const tagsString = Array.isArray(item.tags) ? item.tags.join(', ') : item.tags;

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-6 flex items-center">
                <Link href={`/item/${itemId}`} className="flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Insight
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Knowledge Item</h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Update the title, content, or metadata of your saved insight.
                </p>
            </div>

            <EditForm
                initialData={{
                    id: item.id,
                    title: item.title,
                    type: item.type,
                    content: cleanContent,
                    tags: tagsString,
                    url: sourceUrl
                }}
            />
        </div>
    );
}
