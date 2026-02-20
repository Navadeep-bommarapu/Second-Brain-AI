'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/Card';

export default function DocsPage() {
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, delay: i * 0.1 },
        }),
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 pb-16">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">Architecture & Design Principles</h1>
                <p className="text-xl text-neutral-500 dark:text-neutral-400">
                    Documentation for the Second Brain application built for the Altibbe/Hedamo Assignment.
                </p>
            </div>

            <div className="space-y-8">
                <motion.div custom={0} initial="hidden" animate="visible" variants={variants}>
                    <Card>
                        <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
                            <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">1. Portable Architecture</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="leading-relaxed">
                                The application is built with strong separation of concerns across the tech stack to ensure swappability:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
                                <li><strong>UI Layer (Next.js App Router):</strong> Components are modularized inside <code>app/components/ui</code>. The state management is decoupled from the data fetching, allowing easy migration to alternative UI frameworks or state libraries.</li>
                                <li><strong>Data Layer (PostgreSQL & pg):</strong> Interactions with the database are cleanly abstracted in <code>lib/queries.ts</code>. The application logic is agnostic to the database provider (e.g., Neon or Supabase) as long as it speaks standard SQL.</li>
                                <li><strong>AI Layer (Vercel AI SDK):</strong> We use <code>@ai-sdk/openai</code>, which provides a unified interface. Changing the underlying provider from OpenAI to Anthropic or Gemini just requires swapping the provider call in the API routes.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div custom={1} initial="hidden" animate="visible" variants={variants}>
                    <Card>
                        <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
                            <CardTitle className="text-2xl text-purple-600 dark:text-purple-400">2. Principles-Based UX</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="leading-relaxed">
                                The design is guided by three core interaction principles:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
                                <li><strong>Calm Intelligence:</strong> AI features like auto-tagging and summarization happen quietly in the background upon capture. They augment rather than interrupt the user&apos;s flow.</li>
                                <li><strong>Contextual Motion:</strong> Animation is used purposefully. Framer Motion drives layout shifts when filtering the dashboard and handles subtle micro-interactions on buttons, providing tactile feedback without overwhelming the senses.</li>
                                <li><strong>Clear Hierarchy:</strong> Information density is balanced. Cards emphasize titles and badges (type/tags) while hiding dense content behind summaries, allowing quick scanning of the knowledge base.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div custom={2} initial="hidden" animate="visible" variants={variants}>
                    <Card>
                        <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
                            <CardTitle className="text-2xl text-green-600 dark:text-green-400">3. Agent Thinking</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="leading-relaxed">
                                The "Second Brain" isn&apos;t just passive storage; it actively curates itself:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
                                <li><strong>Auto-Summarization:</strong> When verbose text or links are pasted, the AI distills the core insight into a brief, scannable summary before saving to Postgres.</li>
                                <li><strong>Auto-Categorization (Tags):</strong> If the user is in a hurry and omits tags, the server-side AI infers up to 3 relevant tags based strictly on the content provided, maintaining system organization automatically.</li>
                                <li>This ensures the knowledge base becomes more interconnected and searchable over time, preventing it from degenerating into a chaotic dump of unorganized links.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div custom={3} initial="hidden" animate="visible" variants={variants}>
                    <Card>
                        <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
                            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">4. Infrastructure Mindset</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="leading-relaxed">
                                A true Second Brain must be extensible. We&apos;ve built the application with external access in mind:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
                                <li><strong>Public API Endpoint:</strong> We exposed <code>GET /api/public/brain/query?q=topic</code>. It allows external applications or websites to query the brain. The endpoint returns structured JSON containing both an AI-synthesized answer and the original array of source references.</li>
                                <li><strong>CORS configuration:</strong> The endpoint is explicitly configured with wide CORS headers (<code>Access-Control-Allow-Origin: *</code>) to ensure it can be easily embedded directly as an iframe or consumed via `fetch` from external widget applications.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
