import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MulterConfig {
  private config: ConfigService<Record<string, unknown>, false>;
  constructor() {
    this.config = new ConfigService();
    console.log('???');
  }
  options = () => ({
    limits: {
      fileSize: +this.config.get('MAX_FILE_SIZE'),
    },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
      console.log(file.mimetype, 'Files');
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif|mp4|mp3)$/)) {
        // Allow storage of file
        cb(null, true);
      } else {
        // Reject file
        console.log(file.originalname, 'Err');

        cb(
          new HttpException(
            {
              message: `Unsupported file type ${extname(file.originalname)}`,
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
          false,
        );
      }
    },
    // Storage properties
    storage: diskStorage({
      // Destination storage path details
      destination: (req: any, file: any, cb: any) => {
        const uploadPath = this.config.get('UPLOAD_POST');

        // Create folder if doesn't exist
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
      },
      // File modification details
      filename: (req: any, file: any, cb: any) => {
        // Calling the callback passing the random name generated with the original extension name
        cb(null, `${uuid()}${extname(file.originalname)}`);
      },
    }),
  });
}
