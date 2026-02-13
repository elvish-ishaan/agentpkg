import { getBucket } from '../config/gcp.js';
import { logger } from '../utils/logger.js';
import { InternalServerError } from '../utils/errors.js';

export class StorageService {
  /**
   * Upload file to GCS
   */
  async uploadFile(path: string, content: string): Promise<void> {
    try {
      const bucket = getBucket();
      const file = bucket.file(path);

      await file.save(content, {
        metadata: {
          contentType: 'text/markdown',
          cacheControl: 'public, max-age=3600',
        },
      });

      logger.info(`File uploaded to GCS: ${path}`);
    } catch (error) {
      logger.error({ error, path }, 'Failed to upload file to GCS');
      throw new InternalServerError('Failed to upload file to storage');
    }
  }

  /**
   * Generate signed URL for file download (15 minutes expiry)
   */
  async getSignedUrl(path: string): Promise<string> {
    try {
      const bucket = getBucket();
      const file = bucket.file(path);

      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      });

      return url;
    } catch (error) {
      logger.error({ error, path }, 'Failed to generate signed URL');
      throw new InternalServerError('Failed to generate download URL');
    }
  }

  /**
   * Check if file exists in GCS
   */
  async fileExists(path: string): Promise<boolean> {
    try {
      const bucket = getBucket();
      const file = bucket.file(path);
      const [exists] = await file.exists();
      return exists;
    } catch (error) {
      logger.error({ error, path }, 'Failed to check file existence');
      return false;
    }
  }

  /**
   * Delete file from GCS
   */
  async deleteFile(path: string): Promise<void> {
    try {
      const bucket = getBucket();
      const file = bucket.file(path);
      await file.delete();
      logger.info(`File deleted from GCS: ${path}`);
    } catch (error) {
      logger.error({ error, path }, 'Failed to delete file from GCS');
      throw new InternalServerError('Failed to delete file from storage');
    }
  }

  /**
   * Download file content from GCS
   */
  async downloadFile(path: string): Promise<string> {
    try {
      const bucket = getBucket();
      const file = bucket.file(path);
      const [content] = await file.download();
      return content.toString('utf8');
    } catch (error) {
      logger.error({ error, path }, 'Failed to download file from GCS');
      throw new InternalServerError('Failed to download file from storage');
    }
  }
}

export const storageService = new StorageService();
