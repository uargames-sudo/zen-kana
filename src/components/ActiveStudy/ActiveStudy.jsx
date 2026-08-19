import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SpellCheck, MessageSquareText, BookOpenText } from 'lucide-react';
import KanaStudy from './KanaStudy';
import PhrasesStudio from './PhrasesStudio';
import StoryReader from './StoryReader';

export default function ActiveStudy() {
    const { lang } = useLanguage();
    const [activeTab, setActiveTab] = useState('kana');

    const tabs = [
        {
            id: 'kana',
            label: lang === 'it' ? 'Kana / Vocabolario' : 'Kana / Vocabulary',
            icon: SpellCheck
        },
        {
            id: 'phrases',
            label: lang === 'it' ? 'Frasi Utili' : 'Survival Phrases',
            icon: MessageSquareText
        },
        {
            id: 'stories',
            label: lang === 'it' ? 'Short Stories' : 'Short Stories',
            icon: BookOpenText
        }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-140px)]">
            {/* Tabs Header */}
            <div className="flex items-center justify-center gap-2 mb-6 px-4 pt-6">
                <div className="bg-zen-surface-container dark:bg-zen-dark-surface p-1 rounded-2xl flex flex-nowrap border border-zen-border/40 dark:border-zen-dark-border w-full sm:w-auto shadow-zen-sm">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                                    isActive 
                                        ? 'bg-zen-surface dark:bg-zen-dark-bg text-zen-primary dark:text-zen-dark-primary shadow-sm border border-zen-border/40 dark:border-zen-dark-border/60' 
                                        : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
                                }`}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span className={isActive ? '' : 'hidden sm:block'}>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 w-full">
                {activeTab === 'kana' && <KanaStudy />}
                {activeTab === 'phrases' && <PhrasesStudio />}
                {activeTab === 'stories' && <StoryReader />}
            </div>
        </div>
    );
}
