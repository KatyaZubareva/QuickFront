"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/webhook.routes.ts
const express_1 = require("express");
const webhook_controller_1 = require("../controllers/webhook.controller");
const router = (0, express_1.Router)();
/**
 * GitHub Webhook Endpoint
 * @route POST /webhooks
 * @desc Handles incoming GitHub webhook events
 * @access Public (but requires valid GitHub signature)
 */
router.post('/', (req, res, next) => {
    if (req.headers['content-type'] !== 'application/json') {
        res.status(415).json({ error: 'Unsupported Media Type' });
        return;
    }
    next();
}, (req, res, next) => {
    try {
        (0, webhook_controller_1.handleWebhook)(req, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
