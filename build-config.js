// Build script to generate config.js with environment variables
const fs = require('fs');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Log build status
console.log('📦 Building config.js...');
if (supabaseUrl && supabaseAnonKey) {
  console.log('✅ Environment variables loaded successfully');
} else {
  console.warn('⚠️  Missing environment variables - add them in Vercel project settings');
}

const config = `// Supabase Configuration - Generated at build time
window.ENV = {
  SUPABASE_URL: '${supabaseUrl}',
  SUPABASE_ANON_KEY: '${supabaseAnonKey}'
};
`;

fs.writeFileSync('config.js', config);
console.log('✅ config.js generated');
