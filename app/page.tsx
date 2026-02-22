'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/Badge';
import { Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { Skeleton } from '@/app/components/ui/Skeleton';
import { format } from 'date-fns';
import { Search, Filter, BookOpen, Link as LinkIcon, Lightbulb, ExternalLink, MessageSquare, Trash2, Edit3, LogIn } from 'lucide-react';
import Link from 'next/link';
import { DeleteConfirmationModal } from '@/app/components/DeleteConfirmationModal';
import { useSession, signIn } from 'next-auth/react';

interface KnowledgeItem {
  id: number;
  title: string;
  content: string;
  type: 'note' | 'link' | 'insight';
  tags: string | string[];
  summary?: string;
  created_at: string;
}

export default function Dashboard() {
  const { status } = useSession();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    async function fetchItems() {
      if (status !== 'authenticated') return;
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.append('q', debouncedSearch);
        if (selectedType !== 'all') params.append('type', selectedType);

        const res = await fetch(`/api/knowledge?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchItems();
    }
  }, [debouncedSearch, selectedType, status]);

  if (status === 'loading') {
    return <div className="p-12 flex justify-center"><Skeleton className="h-12 w-12 rounded-full" /></div>;
  }

  const confirmDelete = async () => {
    if (itemToDelete === null) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/knowledge/${itemToDelete}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');

      setItems(prev => prev.filter(item => item.id !== itemToDelete));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item.');
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note': return <BookOpen className="w-4 h-4" />;
      case 'link': return <LinkIcon className="w-4 h-4" />;
      case 'insight': return <Lightbulb className="w-4 h-4 text-purple-500" />;
      default: return null;
    }
  };

  return (
    <div className="relative h-full min-h-[80vh]">
      <div className={`space-y-8 pb-12 transition-all duration-700 ${status === 'unauthenticated' ? 'pointer-events-none blur-md opacity-30 select-none' : ''}`}>
        {/* Header & Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Knowledge Base</h1>
            <p className="text-neutral-500 dark:text-neutral-400">
              Search, filter, and explore your captured insights.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search by title, content, or tags..."
                className="pl-9 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 shrink-0 overflow-x-auto pb-2 sm:pb-0">
              {['all', 'note', 'insight', 'link'].map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'primary' : 'outline'}
                  className="capitalize h-11"
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Grid of Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="min-h-[250px] flex flex-col">
                <CardHeader className="gap-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : items.length === 0 ? (
            <div className="col-span-full py-20 text-center text-neutral-500">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">No items found</p>
              <p>Try adjusting your search or filters, or capture something new.</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => {
                const tagsArray = item.tags
                  ? (Array.isArray(item.tags)
                    ? item.tags
                    : item.tags.split(',').map((t: string) => t.trim()).filter(Boolean))
                  : [];
                const sourceMatch = item.content.match(/Source:\s*(https?:\/\/[^\s]+)/);
                const sourceUrl = sourceMatch ? sourceMatch[1] : null;
                // Clean content by removing the auto-appended source if it exists for display
                const displayContent = item.content.replace(/Source:\s*(https?:\/\/[^\s]+)/, '').trim();

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className="h-full flex flex-col group hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <Badge variant={item.type as any} className="capitalize flex gap-1.5 items-center">
                            {getTypeIcon(item.type)}
                            {item.type}
                          </Badge>
                          <span className="text-xs text-neutral-400 tabular-nums">
                            {format(new Date(item.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <CardTitle className="line-clamp-2 leading-tight group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                          {item.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="flex-1 pb-4">
                        {item.summary ? (
                          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-md mb-4 border border-neutral-100 dark:border-neutral-800">
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-500" /> AI Summary
                            </p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                              {item.summary}
                            </p>
                          </div>
                        ) : null}

                        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-4 whitespace-pre-wrap">
                          {displayContent}
                        </p>
                      </CardContent>

                      <CardFooter className="pt-0 flex flex-wrap gap-2 justify-between items-end">
                        <div className="flex flex-wrap gap-1.5">
                          {tagsArray.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="px-2 font-medium text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {tagsArray.length > 3 && (
                            <Badge variant="secondary" className="px-2 font-medium text-xs">
                              +{tagsArray.length - 3}
                            </Badge>
                          )}
                        </div>
                        {sourceUrl && (
                          <a
                            href={sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs flex items-center gap-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                          >
                            Source <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        <div className="w-full flex justify-between items-center mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/item/${item.id}/edit`}>
                              <button className="p-1.5 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors" title="Edit Item">
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </Link>
                            <button
                              onClick={() => setItemToDelete(item.id)}
                              className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <Link href={`/item/${item.id}`}>
                            <Button
                              variant="primary"
                              size="sm"
                              className="h-8 text-xs font-medium"
                            >
                              <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                              Open
                            </Button>
                          </Link>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {status === 'unauthenticated' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 p-8 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full text-center flex flex-col items-center"
          >
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full mb-6 shadow-inner shadow-blue-500/10">
              <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-neutral-900 dark:text-neutral-100 tracking-tight">Second Brain AI</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8 text-sm leading-relaxed font-medium">
              Sign in to unlock your personal knowledge base. Capture, organize, and chat with your insights using the power of AI.
            </p>
            <Button variant="primary" size="lg" className="w-full text-base font-semibold h-12 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5" onClick={() => signIn('google')}>
              <LogIn className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>
          </motion.div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete Knowledge Item"
        description="Are you sure you want to delete this item? This action will permanently remove it from your knowledge base."
      />
    </div>
  );
}

// Need to import Sparkles explicitly at the top
function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a4.42 4.42 0 0 1 0-8.526L8.5 2.373A2 2 0 0 0 9.937.937l1.582-6.135a4.42 4.42 0 0 1 8.526 0l1.582 6.135a2 2 0 0 0 1.437 1.436l6.135 1.582a4.42 4.42 0 0 1 0 8.526l-6.135 1.582a2 2 0 0 0-1.437 1.436l-1.582 6.135a4.42 4.42 0 0 1-8.526 0l-1.582-6.135z" />
    </svg>
  );
}
