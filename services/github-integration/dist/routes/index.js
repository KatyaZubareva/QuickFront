"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//routes/index.ts
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const repo_routes_1 = __importDefault(require("./repo.routes"));
const webhook_routes_1 = __importDefault(require("./webhook.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/repos', repo_routes_1.default);
router.use('/webhooks', webhook_routes_1.default);
exports.default = router;
