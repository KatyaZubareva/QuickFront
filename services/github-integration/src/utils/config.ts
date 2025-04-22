// src/utils/config.ts
export const validateConfig = () => {
    const requiredVars = [
      'GITHUB_CLIENT_ID',
      'GITHUB_CLIENT_SECRET',
      'FRONTEND_REDIRECT_URI'
    ];
  
    const missing = requiredVars.filter(v => !process.env[v]);
    if (missing.length) {
      throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }
  };