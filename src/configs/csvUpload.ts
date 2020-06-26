import path from 'path';
import multer from 'multer';

const tmpDir = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpDir,

  storage: multer.diskStorage({
    destination: tmpDir,
    filename(request, file, callback) {
      const filename = `${file.originalname}`;

      return callback(null, filename);
    },
  }),
};
