'use client';

import { Edit3, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

export function ItemActions({ itemId }: { itemId: number }) {
    const router = useRouter();
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/knowledge/${itemId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');

            router.push('/');
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item.');
            setIsDeleting(false);
            setIsConfirmingDelete(false);
        }
    };

    return (
        <>
            <div className="flex items-center gap-2">
                <Link href={`/item/${itemId}/edit`} className="p-2 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors" title="Edit Item">
                    <Edit3 className="w-4 h-4" />
                </Link>
                <button
                    onClick={() => setIsConfirmingDelete(true)}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                    title="Delete Item"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <DeleteConfirmationModal
                isOpen={isConfirmingDelete}
                onClose={() => setIsConfirmingDelete(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title="Delete Insight"
                description="Are you sure you want to delete this insight? This action cannot be undone and will permanently remove this data."
            />
        </>
    );
}
