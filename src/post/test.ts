import { AppConfig } from 'src/config/app.config';

const configApp = () => {
  return AppConfig.get('upload');
};
