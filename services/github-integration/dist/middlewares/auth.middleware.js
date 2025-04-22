"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware = (req, res, next) => {
    const token = req.cookies.github_token;
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    next();
};
exports.default = authMiddleware;
