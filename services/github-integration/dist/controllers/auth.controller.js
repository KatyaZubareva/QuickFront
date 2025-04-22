"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.callback = void 0;
const axios_1 = __importDefault(require("axios"));
const callback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.query;
        if (!code || typeof code !== 'string') {
            res.status(400).json({ error: 'Invalid authorization code' });
            return;
        }
        if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
            throw new Error('Missing GitHub OAuth configuration');
        }
        const response = yield axios_1.default.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        }, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        const { access_token } = response.data;
        if (!access_token)
            throw new Error('No access token received');
        res.cookie('github_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000,
            sameSite: 'strict',
            path: '/'
        });
        res.redirect(process.env.FRONTEND_REDIRECT_URI || '/');
    }
    catch (error) {
        handleAuthError(error, res);
    }
});
exports.callback = callback;
function handleAuthError(error, res) {
    var _a, _b, _c, _d, _e;
    console.error('GitHub OAuth error:', {
        message: error.message,
        response: (_a = error.response) === null || _a === void 0 ? void 0 : _a.data,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    const status = ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500;
    const message = ((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.error_description) || 'Failed to authenticate with GitHub';
    res.status(status).json(Object.assign({ error: 'Authentication failed', message }, (process.env.NODE_ENV === 'development' && {
        details: (_e = error.response) === null || _e === void 0 ? void 0 : _e.data
    })));
}
const logout = (req, res) => {
    res.clearCookie('github_token', {
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    });
    res.status(200).json({ success: true, message: 'Successfully logged out' });
};
exports.logout = logout;
exports.default = { callback: exports.callback, logout: exports.logout };
