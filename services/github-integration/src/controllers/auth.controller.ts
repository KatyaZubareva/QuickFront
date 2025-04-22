// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import axios from 'axios';

type AxiosError = {
  message: string;
  response?: {
    status?: number;
    data?: {
      error?: string;
      error_description?: string;
    };
  };
  stack?: string;
};

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export const callback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.query;
    
    if (!code || typeof code !== 'string') {
      res.status(400).json({ error: 'Invalid authorization code' });
      return;
    }

    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      throw new Error('Missing GitHub OAuth configuration');
    }

    const response = await axios.post<GitHubTokenResponse>(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const { access_token } = response.data;
    if (!access_token) throw new Error('No access token received');

    res.cookie('github_token', access_token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000,
      sameSite: 'strict',
      path: '/'
    });

    res.redirect(process.env.FRONTEND_REDIRECT_URI || '/');
  } catch (error) {
    handleAuthError(error as AxiosError, res);
  }
};

function handleAuthError(error: AxiosError, res: Response): void {
  console.error('GitHub OAuth error:', {
    message: error.message,
    response: error.response?.data,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });

  const status = error.response?.status || 500;
  const message = error.response?.data?.error_description || 'Failed to authenticate with GitHub';

  res.status(status).json({ 
    error: 'Authentication failed',
    message,
    ...(process.env.NODE_ENV === 'development' && {
      details: error.response?.data
    })
  });
}

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('github_token', {
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  });
  res.status(200).json({ success: true, message: 'Successfully logged out' });
};

export default { callback, logout };