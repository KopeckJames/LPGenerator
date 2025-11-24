'use server'

import { db } from '@/lib/db';
import { generatePostContent } from '@/lib/ai';
import { revalidatePath } from 'next/cache';

export async function generatePost(topic: string) {
    const content = await generatePostContent(topic);
    return content;
}

export async function savePost(topic: string, content: string, scheduledAt?: Date) {
    console.log('savePost called with:', { topic, content, scheduledAt });
    try {
        const post = await db.post.create({
            data: {
                topic,
                content,
                scheduledAt,
                status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
            },
        });
        console.log('Post created successfully:', post);
        revalidatePath('/');
        revalidatePath('/schedule');
        return post;
    } catch (error) {
        console.error('Failed to save post:', error);
        throw new Error('Failed to save post');
    }
}

export async function updatePost(id: string, content: string) {
    await db.post.update({
        where: { id },
        data: { content }
    });
    revalidatePath('/');
    revalidatePath('/schedule');
}

export async function schedulePost(id: string, date: Date) {
    await db.post.update({
        where: { id },
        data: {
            scheduledAt: date,
            status: 'SCHEDULED',
        },
    });
    revalidatePath('/schedule');
}

export async function getPosts() {
    return await db.post.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
}


export async function deletePost(id: string) {
    await db.post.delete({
        where: { id }
    });
    revalidatePath('/schedule');
}

export async function publishToLinkedIn(postId: string, accessToken: string) {
    console.log('publishToLinkedIn called for post:', postId);

    try {
        // Get the post from database
        const post = await db.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            throw new Error('Post not found');
        }

        // Import LinkedIn service
        const { LinkedInService } = await import('@/lib/linkedin');
        const linkedInService = new LinkedInService(accessToken);

        // Publish to LinkedIn
        console.log('Publishing to LinkedIn...');
        const response = await linkedInService.createPost(post.content);
        console.log('LinkedIn API response:', response);

        // Update post status to PUBLISHED
        await db.post.update({
            where: { id: postId },
            data: { status: 'PUBLISHED' }
        });

        console.log('Post status updated to PUBLISHED');
        revalidatePath('/schedule');

        return { success: true, linkedInPostId: response.id };
    } catch (error) {
        console.error('Failed to publish to LinkedIn:', error);
        throw new Error(`Failed to publish to LinkedIn: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
