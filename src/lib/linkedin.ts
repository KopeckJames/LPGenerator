export interface LinkedInProfile {
    sub: string; // LinkedIn member ID
    name: string;
    email: string;
    picture?: string;
}

export interface LinkedInShareResponse {
    id: string;
    activity: string;
}

export class LinkedInService {
    private accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    async getProfile(): Promise<LinkedInProfile> {
        const response = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch LinkedIn profile');
        }

        return response.json();
    }

    async createPost(text: string): Promise<LinkedInShareResponse> {
        const profile = await this.getProfile();
        console.log('LinkedIn Profile:', profile);

        const shareData = {
            author: `urn:li:person:${profile.sub}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: text,
                    },
                    shareMediaCategory: 'NONE',
                },
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
            },
        };

        console.log('LinkedIn Share Request:', JSON.stringify(shareData, null, 2));

        const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0',
            },
            body: JSON.stringify(shareData),
        });

        console.log('LinkedIn API Response Status:', response.status);

        if (!response.ok) {
            const error = await response.text();
            console.error('LinkedIn API Error:', error);
            throw new Error(`Failed to create LinkedIn post: ${response.status}`);
        }

        const result = await response.json();
        console.log('LinkedIn API Success Response:', result);

        return result;
    }
}
