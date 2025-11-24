'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from './Button';

export const Navigation = () => {
    const { data: session, status } = useSession();

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            LinkGen
                        </Link>
                        <div className="flex space-x-4">
                            <NavLink href="/generate">Generate</NavLink>
                            <NavLink href="/schedule">Schedule</NavLink>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {status === 'loading' ? (
                            <div className="text-sm text-slate-400">Loading...</div>
                        ) : session ? (
                            <>
                                <div className="flex items-center space-x-3">
                                    {session.user?.image && (
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || 'User'}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    )}
                                    <span className="text-sm text-slate-300">{session.user?.name}</span>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => signOut()}
                                    className="text-sm"
                                >
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => signIn('linkedin')}
                                className="text-sm bg-[#0077B5] hover:bg-[#006399] border-none"
                            >
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                Connect LinkedIn
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    return (
        <Link
            href={href}
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
            {children}
        </Link>
    );
};

