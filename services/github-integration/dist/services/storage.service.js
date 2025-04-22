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
exports.StorageService = void 0;
// src/services/storage.service.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
class StorageService {
    constructor() {
        this.storagePath = path_1.default.join(process.cwd(), 'temp-storage');
        this.ensureStorageDirectory();
    }
    ensureStorageDirectory() {
        if (!fs_1.default.existsSync(this.storagePath)) {
            fs_1.default.mkdirSync(this.storagePath, { recursive: true });
        }
    }
    storeFiles(files) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionId = (0, uuid_1.v4)();
            const sessionPath = path_1.default.join(this.storagePath, sessionId);
            fs_1.default.mkdirSync(sessionPath);
            for (const file of files) {
                const filePath = path_1.default.join(sessionPath, file.path);
                const dirname = path_1.default.dirname(filePath);
                if (!fs_1.default.existsSync(dirname)) {
                    fs_1.default.mkdirSync(dirname, { recursive: true });
                }
                fs_1.default.writeFileSync(filePath, file.content);
            }
            return sessionId;
        });
    }
    getFiles(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionPath = path_1.default.join(this.storagePath, sessionId);
            if (!fs_1.default.existsSync(sessionPath)) {
                throw new Error('Session not found');
            }
            return this.readDirectoryRecursive(sessionPath);
        });
    }
    readDirectoryRecursive(dir, basePath = '') {
        const items = fs_1.default.readdirSync(dir);
        const files = [];
        for (const item of items) {
            const fullPath = path_1.default.join(dir, item);
            const relativePath = path_1.default.join(basePath, item);
            const stat = fs_1.default.statSync(fullPath);
            if (stat.isDirectory()) {
                files.push(...this.readDirectoryRecursive(fullPath, relativePath));
            }
            else {
                files.push({
                    path: relativePath,
                    content: fs_1.default.readFileSync(fullPath, 'utf-8')
                });
            }
        }
        return files;
    }
    cleanup(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionPath = path_1.default.join(this.storagePath, sessionId);
            if (fs_1.default.existsSync(sessionPath)) {
                fs_1.default.rmSync(sessionPath, { recursive: true });
            }
        });
    }
}
exports.StorageService = StorageService;
