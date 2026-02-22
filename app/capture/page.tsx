'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Textarea } from '@/app/components/ui/Textarea';
import { Sparkles, Save, CheckCircle2, BookOpen, Link as LinkIcon, Lightbulb, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CustomSelect } from '@/app/components/ui/CustomSelect';
import { useSession, signIn } from 'next-auth/react';

const TYPE_OPTIONS = [
    { value: 'note', label: 'Note', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'insight', label: 'Insight', icon: <Lightbulb className="w-4 h-4 text-purple-500" /> },
    { value: 'link', label: 'Link', icon: <LinkIcon className="w-4 h-4" /> },
];

export default function CapturePage() {
    const { status } = useSession();
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
            url: formData.get('url'),
        };

        try {
            const res = await fetch('/api/knowledge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error('Failed to save knowledge item.');
            }

            setIsSuccess(true);
            (e.target as HTMLFormElement).reset();

            // Auto-redirect after a short delay
            setTimeout(() => {
                router.push('/');
            }, 1500);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading') {
        return <div className="p-12 text-center text-neutral-500">Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center max-w-md mx-auto">
                <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-full mb-6">
                    <BookOpen className="w-8 h-8 text-neutral-500" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">Authentication Required</h2>
                <p className="text-neutral-500 mb-8">Please sign in to capture and save new knowledge to your second brain.</p>
                <Button variant="primary" size="lg" className="w-full" onClick={() => signIn('google')}>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In with Google
                </Button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto mt-8"
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Capture Knowledge</h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Save insights, notes, or links. Our AI will automatically tag and summarize your content if you have configured the API key.
                </p>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>New Entry</CardTitle>
                        <CardDescription>Fill out the details below to add to your Second Brain.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        {isSuccess && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400 p-4 rounded-md flex items-center gap-3"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                <p className="text-sm font-medium">Successfully saved! Redirecting to dashboard...</p>
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
                                <Input id="title" name="title" placeholder="Understanding React Server Components" required />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="type" className="text-sm font-medium leading-none">Type</label>
                                <CustomSelect
                                    name="type"
                                    options={TYPE_OPTIONS}
                                    defaultValue="note"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="content" className="text-sm font-medium leading-none">Content</label>
                            <Textarea
                                id="content"
                                name="content"
                                placeholder="Write your thoughts or paste the core content here..."
                                className="min-h-[150px] resize-y"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="tags" className="text-sm font-medium leading-none">
                                    Tags <span className="text-neutral-500 font-normal">(Optional)</span>
                                </label>
                                <Input id="tags" name="tags" placeholder="e.g. react, nextjs, frontend" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="url" className="text-sm font-medium leading-none">
                                    Source URL <span className="text-neutral-500 font-normal">(Optional)</span>
                                </label>
                                <Input id="url" name="url" type="url" placeholder="https://example.com/article" />
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-between items-center border-t border-neutral-100 dark:border-neutral-800 pt-6">
                        <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 gap-1.5">
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            AI Auto-process enabled
                        </div>
                        <Button type="submit" isLoading={isSubmitting} className="min-w-[120px]">
                            {!isSubmitting && <Save className="w-4 h-4 mr-2" />}
                            {isSubmitting ? 'Saving...' : 'Save to Brain'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </motion.div>
    );
}
