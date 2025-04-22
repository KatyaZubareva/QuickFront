//services/ZipService.ts
import archiver from 'archiver';
import { PassThrough } from 'stream';
import { FileContentMap } from '../types';

class ZipService {
  async createZip(files: FileContentMap): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      });
      
      const stream = new PassThrough();
      const chunks: Buffer[] = [];
      
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
      
      archive.pipe(stream);
      
      // Add files to the archive
      for (const [filePath, content] of Object.entries(files)) {
        archive.append(content, { name: filePath });
      }
      
      archive.finalize();
    });
  }
}

export default ZipService;