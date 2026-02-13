import { Storage } from '@google-cloud/storage';
import { getEnv } from './env.js';
import { logger } from '../utils/logger.js';

let storageClient: Storage | null = null;

export function getStorageClient(): Storage {
  if (!storageClient) {
    const env = getEnv();

    const config: any = {
      projectId: env.GCP_PROJECT_ID,
    };

    // If key file is provided, use it
    if (env.GCP_KEY_FILE) {
      config.keyFilename = env.GCP_KEY_FILE;
    }
    // Otherwise, use application default credentials (for production)

    storageClient = new Storage(config);
    logger.info('GCP Storage client initialized');
  }

  return storageClient;
}

export function getBucket() {
  const env = getEnv();
  const storage = getStorageClient();
  return storage.bucket(env.GCP_BUCKET_NAME);
}
