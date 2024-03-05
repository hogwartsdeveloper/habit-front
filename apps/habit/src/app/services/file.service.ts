import { Injectable } from '@angular/core';

@Injectable()
export class FileService {
  async convertBase64toFile(
    base64: string,
    fileName: string,
    contentType: string
  ): Promise<File> {
    const res = await fetch(base64);
    const blob = await res.blob();

    return new File([blob], fileName, { type: contentType });
  }
}
