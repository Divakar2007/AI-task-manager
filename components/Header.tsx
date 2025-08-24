import React from 'react';
import { HelpIcon } from './icons';

interface HeaderProps {
    onOpenSetupGuide: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSetupGuide }) => {
    return (
        <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg sticky top-0 z-40 shadow-sm">
            <div className="container mx-auto flex justify-between items-center p-4">
                <div className="flex items-center space-x-2">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">AI Task Manager</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={onOpenSetupGuide} className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <HelpIcon />
                        <span className="hidden md:inline">Setup Guide</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;