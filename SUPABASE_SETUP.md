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

## Step 4: Update index.html

Replace the placeholder values in `index.html` (around line 331-332):

```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with your Project URL
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your anon public key
```

## Step 5: Deploy to Vercel

### For Development/Preview:
Since this is a static site (no build process needed for the email form), Vercel will automatically detect it.

1. Push your changes to GitHub
2. Vercel will auto-deploy the dev branch to your preview URL

### Important Notes:

- **No environment variables needed in Vercel** - Since this is a public frontend-only implementation, the Supabase credentials are embedded directly in the HTML
- **Security**: The anon key is safe to expose publicly. It only allows the operations you've explicitly enabled via RLS policies (in this case, just INSERT on `email_signups`)
- **No authentication required** - Users can submit emails without logging in

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
