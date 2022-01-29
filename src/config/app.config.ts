import { Module } from '@nestjs/common';
import { MulterConfig } from './multer-config';

@Module({
  providers: [MulterConfig],
  exports: [MulterConfig],
})
export class AppConfigModule {}
