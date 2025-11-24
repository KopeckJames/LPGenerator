import Link from 'next/link';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">
          Elevate Your Presence
        </h1>
        <p className="text-xl text-slate-400">
          Generate professional, engaging LinkedIn posts in seconds with AI. Schedule your success.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-12">
        <Card className="hover:border-blue-500/50 transition-colors group cursor-pointer">
          <div className="h-full flex flex-col items-center justify-center space-y-4 p-6">
            <div className="p-4 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold">Create Post</h2>
            <p className="text-slate-400">Draft new content with AI assistance</p>
            <Link href="/generate" className="w-full">
              <Button className="w-full">Start Writing</Button>
            </Link>
          </div>
        </Card>

        <Card className="hover:border-purple-500/50 transition-colors group cursor-pointer">
          <div className="h-full flex flex-col items-center justify-center space-y-4 p-6">
            <div className="p-4 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold">Schedule</h2>
            <p className="text-slate-400">Manage your content calendar</p>
            <Link href="/schedule" className="w-full">
              <Button variant="outline" className="w-full">View Calendar</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
