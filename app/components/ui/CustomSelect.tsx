'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface CustomSelectProps {
    name: string;
    options: SelectOption[];
    defaultValue?: string;
    className?: string;
    required?: boolean;
}

export function CustomSelect({ name, options, defaultValue, className, required }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(defaultValue || options[0]?.value || '');
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={selectRef} className={cn("relative", className)}>
            <input type="hidden" name={name} value={value} required={required} />

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 dark:border-neutral-800 dark:bg-neutral-900/50 dark:focus:ring-neutral-300 dark:focus:ring-offset-neutral-950 transition-colors"
            >
                <span className="flex items-center gap-2">
                    {selectedOption?.icon}
                    {selectedOption?.label}
                </span>
                <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border border-neutral-200 bg-white/95 backdrop-blur-md p-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900/95"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    setValue(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-3 pr-9 text-sm outline-none transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800",
                                    value === option.value ? "bg-neutral-100/50 dark:bg-neutral-800/50 font-medium text-neutral-900 dark:text-neutral-50" : "text-neutral-700 dark:text-neutral-300"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    {option.icon}
                                    {option.label}
                                </div>
                                {value === option.value && (
                                    <span className="absolute right-3 flex items-center justify-center text-neutral-900 dark:text-neutral-50">
                                        <Check className="h-4 w-4" />
                                    </span>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
