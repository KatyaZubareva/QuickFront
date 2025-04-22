"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = void 0;
const crypto_1 = __importDefault(require("crypto"));
const handleWebhook = (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);
    if (!signature) {
        return res.status(401).send('Missing signature');
    }
    const hmac = crypto_1.default.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET || '');
    const digest = `sha256=${hmac.update(payload).digest('hex')}`;
    if (signature !== digest) {
        return res.status(401).send('Invalid signature');
    }
    const event = req.headers['x-github-event'];
    switch (event) {
        case 'push':
            handlePushEvent(req.body);
            break;
        case 'pull_request':
            handlePullRequestEvent(req.body);
            break;
        default:
            console.log(`Unhandled event: ${event}`);
    }
    return res.status(200).send('Webhook received');
};
exports.handleWebhook = handleWebhook;
const handlePushEvent = (payload) => {
    if (payload.repository) {
        console.log('Push event received:', payload.repository.full_name);
        // Add your push event handling logic here
    }
};
const handlePullRequestEvent = (payload) => {
    if (payload.pull_request) {
        console.log('Pull request event received:', payload.pull_request.html_url);
        // Add your PR event handling logic here
    }
};
