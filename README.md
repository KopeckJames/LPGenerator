# LinkedIn Post Generator

An AI-powered LinkedIn post generator and scheduler built with Next.js, OpenAI GPT-4, and LinkedIn OAuth.

## Features

- 🤖 **AI Post Generation**: Generate professional LinkedIn posts using OpenAI GPT-4
- 📅 **Calendar View**: Visual calendar interface to manage scheduled posts
- ⏰ **Auto-Publishing**: Automatically publish posts at scheduled times
- 🔐 **LinkedIn OAuth**: Secure authentication with LinkedIn
- 💾 **Local Database**: SQLite database with Prisma ORM
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Screenshots

### Generate Page
Create AI-powered LinkedIn posts with a clean, modern interface.

### Calendar View
Visualize and manage all your scheduled posts in a calendar format.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **AI**: OpenAI GPT-4
- **Authentication**: NextAuth.js v5 with LinkedIn provider
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Date Handling**: date-fns, react-day-picker

## Getting Started

### Prerequisitesfdafdafda

- Node.js 18+ installed
- OpenAI API key
- LinkedIn Developer App credentials

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/KopeckJames/LPGenerator.git
cd LPGenerator
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and add your credentials:
\`\`\`env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your-openai-api-key"
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

4. Set up the database:
\`\`\`bash
npx prisma generate
npx prisma migrate dev
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## LinkedIn App Setup

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Create a new app
3. Add redirect URI: `http://localhost:3000/api/auth/callback/linkedin`
4. Request the following OAuth scopes:
   - `openid`
   - `profile`
   - `email`
   - `w_member_social`
5. Copy your Client ID and Client Secret to `.env`

## Usage

### Generate a Post

1. Navigate to `/generate`
2. Enter a topic for your LinkedIn post
3. Click "Generate Post" to create AI-powered content
4. Edit the generated content if needed
5. Optionally set a date/time to schedule the post
6. Click "Schedule Post" or "Save as Draft"

### Manage Posts

1. Navigate to `/schedule`
2. View all your posts in a calendar format
3. Click on any date to see posts scheduled for that day
4. Publish posts immediately or let them auto-publish at scheduled times

### Auto-Publishing

Posts are automatically published to LinkedIn at their scheduled time. The app checks every minute for posts that are due and publishes them automatically (requires you to be logged in with LinkedIn).

## Project Structure

\`\`\`
├── src/
│   ├── app/
│   │   ├── actions.ts          # Server actions
│   │   ├── generate/           # Post generation page
│   │   ├── schedule/           # Calendar view page
│   │   └── api/auth/           # NextAuth routes
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Navigation.tsx
│   ├── lib/
│   │   ├── ai.ts              # OpenAI integration
│   │   ├── db.ts              # Prisma client
│   │   ├── linkedin.ts        # LinkedIn API
│   │   └── utils.ts           # Utility functions
│   └── auth.ts                # NextAuth configuration
├── prisma/
│   └── schema.prisma          # Database schema
└── .env.example               # Environment variables template
\`\`\`

## Database Schema

\`\`\`prisma
model Post {
  id          String   @id @default(cuid())
  topic       String
  content     String
  scheduledAt DateTime?
  status      String   @default("DRAFT") // DRAFT, SCHEDULED, PUBLISHED
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

James Kopeck
