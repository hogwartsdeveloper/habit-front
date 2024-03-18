import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import {IApiResult} from "../shared/models/api-result";

@Injectable()
export class FileService {
  constructor(private readonly httpClient: HttpClient) {}
  async convertBase64toFile(
    base64: string,
    fileName: string,
    contentType: string
  ): Promise<File> {
    const res = await fetch(base64);
    const blob = await res.blob();

    return new File([blob], fileName, { type: contentType });
  }

  convertFileToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target!.result as string);
      };

      reader.readAsDataURL(file);
    });
  }

  getFile(url: string) {
    return this.httpClient
      .get<IApiResult<Blob>>('/api/File?filePath=' + url)
      .pipe(
        map((res) => {
          if (res.result) {
            return new File([res.result], url);
          }
          
          return null;
        })
      );
  }
}
