import React from 'react';
import { Header } from './Header';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary transition-colors duration-300">
            <Header />
            <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
};
