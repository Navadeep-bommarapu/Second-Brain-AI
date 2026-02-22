'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from './ui/Button';
import { LogIn, LogOut } from 'lucide-react';

export function AuthButton() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div className="h-10 w-full rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>;
    }

    if (session) {
        return (
            <div className="flex flex-col gap-3 p-3 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
                <div className="flex items-center gap-2 px-1 text-sm text-neutral-700 dark:text-neutral-300">
                    {session.user?.image && (
                        <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full shadow-sm" />
                    )}
                    <span className="truncate font-medium">{session.user?.name}</span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-100 dark:border-red-900"
                    onClick={() => signOut()}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </Button>
            </div>
        );
    }

    return null;
}
