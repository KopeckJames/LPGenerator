'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Calendar, Send } from 'lucide-react';
import { generatePost, savePost } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-time-picker';

export default function GeneratePage() {
    const [topic, setTopic] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleGenerate = async () => {
        if (!topic) return;

        setIsGenerating(true);
        try {
            const content = await generatePost(topic);
            setGeneratedContent(content);
        } catch (error) {
            console.error('Failed to generate post:', error);
            alert('Failed to generate post');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!generatedContent) return;

        setIsSaving(true);
        try {
            await savePost(topic, generatedContent, scheduledDate);
            router.push('/schedule');
        } catch (error) {
            console.error('Failed to save post:', error);
            alert('Failed to save post');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-12 space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    AI Post Generator
                </h1>
                <p className="text-muted-foreground">
                    Create engaging LinkedIn posts powered by GPT-4
                </p>
            </div>

            {/* Input Section */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">What would you like to post about?</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., The future of AI in healthcare"
                        className="w-full px-4 py-3 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                </div>

                <Button
                    onClick={handleGenerate}
                    disabled={!topic || isGenerating}
                    className="w-full"
                    size="lg"
                >
                    {isGenerating ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Post
                        </>
                    )}
                </Button>
            </div>

            {/* Preview Section */}
            {generatedContent && (
                <div className="bg-card border border-border rounded-lg p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Preview</h2>
                        <span className="text-xs text-muted-foreground">
                            {generatedContent.length} characters
                        </span>
                    </div>

                    <textarea
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                        className="w-full min-h-[300px] px-4 py-3 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        placeholder="Your generated post will appear here..."
                    />

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Schedule for later (optional)
                            </label>
                            <DateTimePicker date={scheduledDate} setDate={setScheduledDate} />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1"
                                size="lg"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        {scheduledDate ? 'Schedule Post' : 'Save as Draft'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
