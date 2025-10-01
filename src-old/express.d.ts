import { Express } from 'express';
// import type { BusboyConfig } from 'busboy';
import { fileUpload } from 'express-fileupload';

declare global {
  namespace Express {
    interface Request {
      files?: fileUpload.FileArray | null | undefined;
    }
  }
}
