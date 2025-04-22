// src/services/storage.service.ts
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class StorageService {
  private storagePath: string;

  constructor() {
    this.storagePath = path.join(process.cwd(), 'temp-storage');
    this.ensureStorageDirectory();
  }

  private ensureStorageDirectory() {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  async storeFiles(files: Array<{ path: string; content: string }>): Promise<string> {
    const sessionId = uuidv4();
    const sessionPath = path.join(this.storagePath, sessionId);

    fs.mkdirSync(sessionPath);

    for (const file of files) {
      const filePath = path.join(sessionPath, file.path);
      const dirname = path.dirname(filePath);
      
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
      }

      fs.writeFileSync(filePath, file.content);
    }

    return sessionId;
  }

  async getFiles(sessionId: string): Promise<Array<{ path: string; content: string }>> {
    const sessionPath = path.join(this.storagePath, sessionId);
    
    if (!fs.existsSync(sessionPath)) {
      throw new Error('Session not found');
    }

    return this.readDirectoryRecursive(sessionPath);
  }

  private readDirectoryRecursive(dir: string, basePath = ''): Array<{ path: string; content: string }> {
    const items = fs.readdirSync(dir);
    const files: Array<{ path: string; content: string }> = [];

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(basePath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...this.readDirectoryRecursive(fullPath, relativePath));
      } else {
        files.push({
          path: relativePath,
          content: fs.readFileSync(fullPath, 'utf-8')
        });
      }
    }

    return files;
  }

  async cleanup(sessionId: string) {
    const sessionPath = path.join(this.storagePath, sessionId);
    
    if (fs.existsSync(sessionPath)) {
      fs.rmSync(sessionPath, { recursive: true });
    }
  }
}