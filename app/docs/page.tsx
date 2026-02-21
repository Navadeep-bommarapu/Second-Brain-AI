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
                                The app is built in separate layers that can be easily swapped out if needed:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
                                <li><strong>Frontend (User Interface):</strong> Built with React and Next.js. The visual parts are independent of the data, meaning I could easily move them to another framework.</li>
                                <li><strong>Backend (Database):</strong> I use standard SQL with a PostgreSQL database. Since I'm not locked into proprietary features, I can move the data anywhere.</li>
                                <li><strong>AI Brain:</strong> I use an AI toolkit that lets me easily switch the AI provider (like moving from Gemini to Anthropic) just by changing one line of code.</li>
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
                                The design focuses on making the app feel natural and easy to use through these principles:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
                                <li><strong>Quiet AI:</strong> The AI works silently in the background (like auto-tagging things) so it never interrupts you.</li>
                                <li><strong>Helpful Animations:</strong> I use smooth, subtle animations only when they help you understand what's happening on screen, never just for flash.</li>
                                <li><strong>Clean Layouts:</strong> I keep the interface uncluttered by showing only the most important details first, keeping the heavy reading for when you actually click an item.</li>
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
                                The app doesn't just store data; it actively helps keep things organized on its own:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
                                <li><strong>Auto-Summaries:</strong> When you save a long article, the AI automatically reads it and creates a short, easy-to-read summary for you.</li>
                                <li><strong>Smart Tagging:</strong> Forget to add tags? No problem. The app reads your content and adds helpful tags automatically so you can always find it later.</li>
                                <li><strong>Self-Organizing:</strong> By doing these chores automatically, your "Second Brain" stays neat and organized over time, rather than becoming a messy junk drawer.</li>
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
                                I built this so other apps or websites can easily connect to it and use its brainpower:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
                                <li><strong>Open Data Doors (APIs):</strong> I built secure pathways that allow other developer tools to ask the "brain" questions and get smart answers back.</li>
                                <li><strong>Easy Sharing:</strong> The system is set up so you could theoretically embed this knowledge base into another website as a widget, making it a true, accessible service.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
