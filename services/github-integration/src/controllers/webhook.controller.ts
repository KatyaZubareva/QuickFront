// src/controllers/webhook.controller.ts
import { Request, Response } from 'express';
import crypto from 'crypto';

interface WebhookPayload {
  repository?: {
    full_name: string;
  };
  pull_request?: {
    html_url: string;
  };
}

export const handleWebhook = (req: Request, res: Response): Response => {
  const signature = req.headers['x-hub-signature-256'] as string;
  const payload = JSON.stringify(req.body);
  
  if (!signature) {
    return res.status(401).send('Missing signature');
  }

  const hmac = crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET || '');
  const digest = `sha256=${hmac.update(payload).digest('hex')}`;

  if (signature !== digest) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.headers['x-github-event'];
  
  switch (event) {
    case 'push':
      handlePushEvent(req.body as WebhookPayload);
      break;
    case 'pull_request':
      handlePullRequestEvent(req.body as WebhookPayload);
      break;
    default:
      console.log(`Unhandled event: ${event}`);
  }

  return res.status(200).send('Webhook received');
};

const handlePushEvent = (payload: WebhookPayload) => {
  if (payload.repository) {
    console.log('Push event received:', payload.repository.full_name);
    // Add your push event handling logic here
  }
};

const handlePullRequestEvent = (payload: WebhookPayload) => {
  if (payload.pull_request) {
    console.log('Pull request event received:', payload.pull_request.html_url);
    // Add your PR event handling logic here
  }
};