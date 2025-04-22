// src/controllers/repo.controller.ts
import { Request, Response } from 'express';
import { GitHubService } from '../services/github.service';

export const createAndPush = async (req: Request, res: Response): Promise<Response> => {
  const { projectName, projectDescription, files } = req.body;
  const token = req.cookies.github_token;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const github = new GitHubService(token);
    const repo = await github.createRepository(projectName, projectDescription);
    await github.pushFiles(repo.data.full_name, files);
    
    return res.json({ 
      success: true,
      repoUrl: repo.data.html_url
    });
  } catch (error) {
    console.error('Repo creation error:', error);
    return res.status(500).json({ 
      error: 'Failed to create repository',
      ...(process.env.NODE_ENV === 'development' && { details: error instanceof Error ? error.message : 'Unknown error' })
    });
  }
};

export const repoController = {
  createAndPush
};