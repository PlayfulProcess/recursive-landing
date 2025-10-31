# Supabase Email Collection Setup Guide

## Step 1: Verify Supabase Table Exists

The table `newsletter_subscribers` should already exist in your Supabase project with the following schema:

| Column Name | Type | Default Value | Nullable | Notes |
|-------------|------|---------------|----------|-------|
| id | uuid | gen_random_uuid() | No | Primary Key |
| email | text | - | No | UNIQUE constraint |
| subscribed_from | text | 'wellness' | Yes | Tracks source |
| subscribed | boolean | true | Yes | Active status |
| created_at | timestamptz | now() | Yes | Timestamp |

If the table doesn't exist, create it with:
```sql
CREATE TABLE public.newsletter_subscribers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  subscribed_from text DEFAULT 'wellness'::text,
  subscribed boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id)
);
```

## Step 2: Set Row Level Security (RLS)

1. In the table settings, click **"Enable RLS"**
2. Add a new policy:
   - **Policy name**: `Allow anonymous inserts`
   - **Allowed operation**: INSERT
   - **Target roles**: anon
   - **Using expression**: `true`
   - **With check expression**: `true`
3. Click **Save policy**

## Step 3: Get Your Supabase Credentials

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxxxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 4: Configure Environment Variables

**IMPORTANT**: The Supabase credentials are NOT stored in the code repository for security. You must add them to Vercel.

### Add Environment Variables to Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these two variables:

   **First Variable:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase URL from Step 3 (e.g., `https://xxxxxxxxx.supabase.co`)
   - **Environments**: Check Production, Preview, and Development

   **Second Variable:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon key from Step 3 (starts with `eyJ...`)
   - **Environments**: Check Production, Preview, and Development

4. Click **Save** for each variable

Vercel will automatically replace the placeholders in `config.js` at build time with these values.

### For Local Development (Optional):

If you want to test locally, create a `.env.local` file in the `recursive-landing` folder:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Note**: The `.env.local` file is in `.gitignore` and will NOT be committed to the repository. You need to create it manually.

## Step 5: Deploy to Vercel

1. Make sure you've added the environment variables in Step 4
2. Push your changes to GitHub
3. Vercel will auto-deploy and inject the environment variables at build time
4. The email form will be live and ready to collect signups!

### Important Notes:

- **Security**: The anon key is safe to expose in the deployed site. It only allows INSERT operations on `newsletter_subscribers` (controlled by RLS policies)
- **No authentication required** - Users can submit emails without logging in
- **Environment variables are secure** - They're stored in Vercel, not in your code repository

## Testing

1. Visit your deployed site
2. Scroll to the "Find Your PlayfulProcess" section
3. Enter an email and click "Join Us"
4. Check your Supabase table to see if the email was inserted

## Viewing Collected Emails

To view collected emails:
1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select `newsletter_subscribers` table
4. You'll see all submitted emails with timestamps and source tracking

## Future Enhancements

- Add email validation
- Prevent duplicate email submissions
- Add a confirmation email via Supabase Edge Functions
- Export emails to a CSV for your email marketing tool
