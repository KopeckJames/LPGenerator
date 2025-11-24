'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPosts, publishToLinkedIn, deletePost } from '@/app/actions';
import { useRouter } from 'next/navigation';

type Post = {
    id: string;
    topic: string;
    content: string;
    scheduledAt: Date | null;
    status: string;
    createdAt: Date;
};

export default function SchedulePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [publishingId, setPublishingId] = useState<string | null>(null);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        loadPosts();
        // Check for posts to publish every minute
        const interval = setInterval(checkAndPublishPosts, 60000);
        return () => clearInterval(interval);
    }, []);

    const loadPosts = async () => {
        try {
            const data = await getPosts();
            setPosts(data);
        } catch (error) {
            console.error('Failed to load posts:', error);
        }
    };

    const checkAndPublishPosts = async () => {
        if (!session?.accessToken) return;

        const now = new Date();
        const postsToPublish = posts.filter(post =>
            post.status === 'SCHEDULED' &&
            post.scheduledAt &&
            new Date(post.scheduledAt) <= now
        );

        for (const post of postsToPublish) {
            try {
                await publishToLinkedIn(post.id, session.accessToken);
                console.log(`Auto-published post: ${post.id}`);
            } catch (error) {
                console.error(`Failed to auto-publish post ${post.id}:`, error);
            }
        }

        if (postsToPublish.length > 0) {
            await loadPosts();
        }
    };

    const handlePublish = async (id: string) => {
        if (!session?.accessToken) {
            alert('Please connect your LinkedIn account first');
            return;
        }

        setPublishingId(id);
        try {
            await publishToLinkedIn(id, session.accessToken);
            alert('Post published to LinkedIn! 🎉');
            await loadPosts();
        } catch (error) {
            alert(`Failed to publish: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setPublishingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this post?")) return;
        try {
            await deletePost(id);
            await loadPosts();
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    // Calendar logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const getPostsForDate = (date: Date) => {
        return posts.filter(post =>
            post.scheduledAt && isSameDay(new Date(post.scheduledAt), date)
        );
    };

    const selectedPosts = selectedDate ? getPostsForDate(selectedDate) : [];

    return (
        <div className="max-w-7xl mx-auto py-12 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Content Calendar
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Schedule and manage your LinkedIn posts
                    </p>
                </div>
                <Button onClick={() => router.push('/generate')}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Post
                </Button>
            </div>

            {/* Calendar */}
            <div className="bg-card border border-border rounded-lg p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">
                        {format(currentDate, 'MMMM yyyy')}
                    </h2>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentDate(new Date())}
                        >
                            Today
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                            {day}
                        </div>
                    ))}

                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {/* Calendar days */}
                    {daysInMonth.map(day => {
                        const dayPosts = getPostsForDate(day);
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const isCurrentDay = isToday(day);

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => setSelectedDate(day)}
                                className={`
                                    aspect-square p-2 rounded-lg border transition-all
                                    ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/50'}
                                    ${isCurrentDay && !isSelected ? 'bg-accent' : ''}
                                    ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}
                                `}
                            >
                                <div className="text-sm font-medium">{format(day, 'd')}</div>
                                {dayPosts.length > 0 && (
                                    <div className="mt-1 flex gap-1 flex-wrap justify-center">
                                        {dayPosts.slice(0, 3).map((post, i) => (
                                            <div
                                                key={i}
                                                className={`w-1.5 h-1.5 rounded-full ${post.status === 'PUBLISHED' ? 'bg-blue-500' :
                                                        post.status === 'SCHEDULED' ? 'bg-green-500' : 'bg-yellow-500'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Date Posts */}
            {selectedDate && (
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <h3 className="text-xl font-semibold">
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </h3>

                    {selectedPosts.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No posts scheduled for this date</p>
                    ) : (
                        <div className="space-y-3">
                            {selectedPosts.map(post => (
                                <div key={post.id} className="bg-background border border-border rounded-lg p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs px-2 py-1 rounded-full ${post.status === 'PUBLISHED' ? 'bg-blue-500/20 text-blue-400' :
                                                        post.status === 'SCHEDULED' ? 'bg-green-500/20 text-green-400' :
                                                            'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {post.status}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {post.scheduledAt && format(new Date(post.scheduledAt), 'h:mm a')}
                                                </span>
                                            </div>
                                            <h4 className="font-medium">{post.topic}</h4>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                {post.content}
                                            </p>
                                        </div>
                                    </div>

                                    {post.status === 'SCHEDULED' && (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handlePublish(post.id)}
                                                disabled={!session?.accessToken || publishingId === post.id}
                                            >
                                                {publishingId === post.id ? 'Publishing...' : 'Publish Now'}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
