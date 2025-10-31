// Supabase Configuration
// This file reads environment variables and makes them available to the frontend
// Environment variables are injected by Vercel at build time
// You must set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel project settings

window.ENV = {
  SUPABASE_URL: '%NEXT_PUBLIC_SUPABASE_URL%',
  SUPABASE_ANON_KEY: '%NEXT_PUBLIC_SUPABASE_ANON_KEY%'
};

// Validation: Check if environment variables were properly injected
if (window.ENV.SUPABASE_URL.startsWith('%') || window.ENV.SUPABASE_ANON_KEY.startsWith('%')) {
  console.error('❌ Supabase environment variables not configured!');
  console.error('Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your Vercel project settings.');
  console.error('See SUPABASE_SETUP.md for instructions.');
}
