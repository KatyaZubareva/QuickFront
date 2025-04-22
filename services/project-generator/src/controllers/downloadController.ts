//controllers/DownloadController
import { Request, Response } from 'express';
import ProjectGenerator from '../services/projectGenerator';
import ZipService from '../services/zipService';
import { ProjectConfig } from '../types';

class DownloadController {
  async downloadProject(req: Request, res: Response) {
    try {
      const encodedParams = req.query.params as string;
      if (!encodedParams) {
        return res.status(400).json({ error: 'Missing parameters' });
      }

      // Decode base64 params
      const config: ProjectConfig = JSON.parse(
        Buffer.from(encodedParams, 'base64').toString('utf-8')
      );

      // Validate config
      if (!config.framework || !config.projectName) {
        return res.status(400).json({ error: 'Invalid project configuration' });
      }

      // Generate project files
      const generator = new ProjectGenerator();
      const projectFiles = await generator.generate(config);

      // Create zip
      const zipService = new ZipService();
      const zipBuffer = await zipService.createZip(projectFiles);

      // Set response headers
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=${config.projectName}.zip`,
        'Content-Length': zipBuffer.length
      });

      // Send the zip file
      res.send(zipBuffer);

    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to generate project'
      });
    }
  }
}

export default new DownloadController();