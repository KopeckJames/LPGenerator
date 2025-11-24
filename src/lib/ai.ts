import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePostContent(topic: string): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not defined');
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional LinkedIn content creator. Generate an engaging, professional LinkedIn post about the given topic. Include emojis and hashtags. The tone should be inspiring and thought-provoking."
                },
                { role: "user", content: topic }
            ],
            model: "gpt-4o",
        });

        return completion.choices[0].message.content || "Failed to generate content.";
    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw new Error("Failed to generate post via OpenAI.");
    }
}
