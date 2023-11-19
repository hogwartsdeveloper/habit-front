import { Multer } from 'multer';

export class MFile {
  readonly originalname: string;
  readonly buffer: Buffer;

  constructor(file: Express.Multer.File | MFile) {
    this.originalname = file.originalname;
    this.buffer = file.buffer;
  }
}
