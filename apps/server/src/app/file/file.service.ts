import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as process from 'process';
import dayjs from 'dayjs';
import sharp from 'sharp';
import { ensureDir, writeFile } from 'fs-extra';
import * as fs from 'fs';

import { FileResponseDto } from './dto/file-response.dto';
import { MFile } from './mfile.class';
import { FILE_REMOVE_ERROR } from './file.constant';

@Injectable()
export class FileService {
  async saveFiles(files: MFile[]): Promise<FileResponseDto[]> {
    const today = dayjs().format('YYYY-MM-DD');
    const uploadFolder = `${process.cwd()}/uploads/${today}`;
    await ensureDir(uploadFolder);

    const res: FileResponseDto[] = [];
    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);

      res.push({
        url: `static/${today}/${file.originalname}`,
        name: file.originalname,
      });
    }

    return res;
  }

  async checkFile(path: string) {
    return new Promise<boolean>((resolve) => {
      fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
          resolve(false);
        }
        resolve(true);
      });
    });
  }

  async removeFile(path) {
    fs.unlink(path, (err) => {
      if (err) {
        throw new InternalServerErrorException(FILE_REMOVE_ERROR);
      }
    });
  }

  convertToWebP(file: Buffer) {
    return sharp(file).webp().toBuffer();
  }
}
