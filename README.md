# ResumeAI - ATS-Compliant Resume Optimizer

An AI-powered web application that helps job seekers create ATS-compliant resumes and track their job applications using Claude AI.

## Features

- **AI-Powered Resume Optimization**: Analyzes job descriptions and optimizes your resume with relevant keywords
- **ATS Compliance**: Ensures your resume passes Applicant Tracking Systems
- **Cover Letter Generation**: Creates personalized cover letters for each application
- **Application Tracking**: Track all your job applications in one place
- **File Upload**: Support for PDF and Markdown resume formats
- **Subscription Management**: Free tier (3 optimizations/month) and Premium tier (unlimited)

## Tech Stack

- **Frontend**: Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Netlify Blobs
- **AI**: Claude API (Anthropic)
- **Payments**: Stripe
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 20 or higher
- PostgreSQL database (Neon, Supabase, or Railway recommended)
- Netlify CLI for local development with Blobs
- Accounts for:
  - Clerk (authentication)
  - Stripe (payments)
  - Anthropic (Claude API)
  - Netlify (hosting and Blob storage)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**

   The `.env.local` file template is already created. Fill in your API keys:

   ```env
   # Database
   DATABASE_URL="your_postgresql_connection_string"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   CLERK_WEBHOOK_SECRET="your_clerk_webhook_secret"

   # Netlify Blobs
   # Note: Netlify Blobs work automatically when deployed
   # For local dev, use: netlify dev

   # Anthropic Claude API
   ANTHROPIC_API_KEY="your_anthropic_api_key"

   # Stripe
   STRIPE_SECRET_KEY="your_stripe_secret_key"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
   STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
   STRIPE_SUBSCRIPTION_PRICE_ID="your_stripe_price_id"

   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Setup the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**

   For local development with Netlify Blobs support:
   ```bash
   netlify dev
   ```

   Or use regular Next.js dev (Blobs won't work locally):
   ```bash
   npm run dev
   ```

5. **Open the app**

   Navigate to [http://localhost:8888](http://localhost:8888) (netlify dev) or [http://localhost:3000](http://localhost:3000) (npm run dev)

## Configuration Guides

### 1. Clerk Setup

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy the publishable and secret keys to your `.env.local`
4. In the Clerk dashboard, configure:
   - Sign-in/Sign-up URLs: `/sign-in` and `/sign-up`
   - Redirect URLs: `/dashboard`
5. Setup webhook for user sync:
   - Go to Webhooks in Clerk dashboard
   - Add endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Subscribe to `user.created` and `user.deleted` events
   - Copy the signing secret to `CLERK_WEBHOOK_SECRET`

### 2. Stripe Setup

1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your API keys from the Developers section
3. Create a subscription product:
   - Product name: "ResumeAI Premium"
   - Price: $19.99/month (recurring)
   - Copy the Price ID to `STRIPE_SUBSCRIPTION_PRICE_ID`
4. Setup webhook:
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Subscribe to: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

### 3. PostgreSQL Database

**Option A: Neon (Recommended)**
1. Go to [neon.tech](https://neon.tech) and create account
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

**Option B: Supabase**
1. Go to [supabase.com](https://supabase.com) and create account
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (use "Direct Connection")

**Option C: Railway**
1. Go to [railway.app](https://railway.app) and create account
2. Create a new PostgreSQL database
3. Copy the connection string

### 4. Anthropic Claude API

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account and add credits
3. Go to API Keys and create a new key
4. Copy the key to `ANTHROPIC_API_KEY`

### 5. Netlify Blobs

Netlify Blobs work automatically when deployed to Netlify - no setup required!

For local development:
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run your app with: `netlify dev`
3. Blobs will be available at `/.netlify/blobs/serve/`

No API keys or tokens needed!

## Deployment

### Deploy to Netlify

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect your GitHub repository
   - Configure build settings (should auto-detect from `netlify.toml`)

3. **Add Environment Variables**
   - In Netlify dashboard, go to Site settings > Environment variables
   - Add all environment variables from `.env.local`
   - Update `NEXT_PUBLIC_APP_URL` to your Netlify domain

4. **Deploy**
   - Netlify will automatically deploy on push to main branch
   - Update webhook URLs in Clerk and Stripe to use your Netlify domain

## Project Structure

```
resumeai/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Protected dashboard pages
│   ├── sign-in/          # Clerk sign-in page
│   ├── sign-up/          # Clerk sign-up page
│   ├── layout.tsx        # Root layout with Clerk
│   └── page.tsx          # Landing page
├── components/           # Reusable React components
├── lib/
│   ├── auth.ts          # Authentication utilities
│   ├── blob.ts          # File storage utilities
│   ├── claude.ts        # Claude API client
│   ├── parsers.ts       # PDF/Markdown parsers
│   ├── prisma.ts        # Prisma client
│   └── stripe.ts        # Stripe client
├── prisma/
│   └── schema.prisma    # Database schema
└── middleware.ts        # Clerk middleware
```

## API Endpoints

### Authentication
- `POST /api/webhooks/clerk` - Clerk user sync webhook

### Stripe
- `POST /api/stripe/create-checkout` - Create subscription checkout
- `POST /api/stripe/create-portal` - Create customer portal session
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Resumes
- `GET /api/upload/resume` - List user's resumes
- `POST /api/upload/resume` - Upload and parse resume

### Applications
- `GET /api/applications` - List all applications
- `GET /api/applications/[id]` - Get single application
- `PATCH /api/applications/[id]` - Update application status
- `POST /api/optimize-resume` - Create optimized application
- `POST /api/generate-cover-letter` - Generate cover letter

## Database Schema

- **User**: User account (synced with Clerk)
- **Resume**: Uploaded resume files
- **JobApplication**: Job applications with optimized resumes
- **CoverLetter**: Generated cover letters

See `prisma/schema.prisma` for full schema.

## License

MIT License - feel free to use this for your own projects.
