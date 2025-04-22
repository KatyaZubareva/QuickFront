"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
// Create Express application
const app = (0, express_1.default)();
// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';
// CORS configuration
const corsOptions = {
    origin: isProduction
        ? ['https://your-production-domain.com']
        : ['http://localhost:3001'],
    credentials: true,
    optionsSuccessStatus: 200
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)(isProduction ? 'combined' : 'dev'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// API routes
app.use('/api', routes_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});
app.use('/auth', auth_routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error:`, err.stack);
    res.status(500).json(Object.assign({ error: isProduction ? 'Internal server error' : err.message }, (!isProduction && { stack: err.stack })));
});
// Server configuration with proper port type handling
const getPort = () => {
    const port = process.env.PORT;
    if (!port)
        return 3002; // Default port
    const parsedPort = parseInt(port, 10);
    if (isNaN(parsedPort)) {
        console.warn(`Invalid PORT "${port}", using default 3002`);
        return 3002;
    }
    if (parsedPort < 1 || parsedPort > 65535) {
        console.warn(`PORT ${parsedPort} out of range, using default 3002`);
        return 3002;
    }
    return parsedPort;
};
const PORT = getPort();
const HOST = process.env.HOST || '0.0.0.0';
// Start server
const server = app.listen(PORT, HOST, () => {
    console.log(`[${new Date().toISOString()}] Server started`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Listening on: http://${HOST}:${PORT}`);
});
// Handle server errors
server.on('error', (error) => {
    if (error.syscall !== 'listen')
        throw error;
    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${PORT} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${PORT} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});
// Handle process signals
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server terminated');
    });
});
exports.default = app;
