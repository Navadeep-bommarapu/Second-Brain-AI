'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Textarea } from '@/app/components/ui/Textarea';
import { Save, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface EditFormData {
    id: number;
    title: string;
    type: string;
    content: string;
    tags: string;
    url: string;
}

export function EditForm({ initialData }: { initialData: EditFormData }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setIsSuccess(false);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get('title'),
            type: formData.get('type'),
            content: formData.get('content'),
            tags: formData.get('tags'),
        };

        try {
            const res = await fetch(`/api/knowledge/${initialData.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error('Failed to update knowledge item.');
            }

            setIsSuccess(true);
            router.refresh(); // Invalidate server cache

            // Auto-redirect back to the item page
            setTimeout(() => {
                router.push(`/item/${initialData.id}`);
            }, 1000);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Modification</CardTitle>
                        <CardDescription>Changes made here will permanently update the database record.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        {isSuccess && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400 p-4 rounded-md flex items-center gap-3"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                <p className="text-sm font-medium">Successfully updated! Redirecting...</p>
                            </motion.div>
                        )}

                        {error && (
                            <div className="bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400 p-4 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="title" className="text-sm font-medium leading-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70">
                                    Title
                                </label>
                                <Input id="title" name="title" defaultValue={initialData.title} placeholder="Understanding React Server Components" required />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="type" className="text-sm font-medium leading-none">Type</label>
                                <select
                                    id="type"
                                    name="type"
                                    defaultValue={initialData.type}
                                    className="flex h-10 w-full rounded-md border border-neutral-200 bg-white/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900/50 dark:focus:ring-neutral-300 dark:focus:ring-offset-neutral-950 appearance-none"
                                    required
                                >
                                    <option value="note">Note</option>
                                    <option value="insight">Insight</option>
                                    <option value="link">Link</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="content" className="text-sm font-medium leading-none">Content</label>
                            <Textarea
                                id="content"
                                name="content"
                                defaultValue={initialData.content}
                                placeholder="Write your thoughts or paste the core content here..."
                                className="min-h-[150px] resize-y"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="tags" className="text-sm font-medium leading-none">
                                    Tags <span className="text-neutral-500 font-normal">(Comma separated)</span>
                                </label>
                                <Input id="tags" name="tags" defaultValue={initialData.tags} placeholder="e.g. react, nextjs, frontend" />
                            </div>

                            <div className="space-y-2">
                                {/* Disabled because URL is stitched into content optionally for new captures, but hard to structurally decouple on edit without destroying DB summaries */}
                                <label htmlFor="url" className="text-sm font-medium leading-none text-neutral-400">
                                    Source URL <span className="text-neutral-500 font-normal opacity-50">(Locked after capture)</span>
                                </label>
                                <Input id="url" name="url" defaultValue={initialData.url} disabled className="opacity-50" />
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-end items-center border-t border-neutral-100 dark:border-neutral-800 pt-6">
                        <Button type="submit" isLoading={isSubmitting} className="min-w-[120px]">
                            {!isSubmitting && <Save className="w-4 h-4 mr-2" />}
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </motion.div>
    );
}
